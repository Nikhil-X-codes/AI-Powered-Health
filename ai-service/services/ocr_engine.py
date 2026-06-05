"""
OCR Engine Singleton
Loads the OCR model once at startup.
"""

import io
import os
import tempfile
import warnings

# Disable PaddlePaddle's oneDNN (MKLDNN) and PIR executor on CPU to avoid ConvertPirAttribute2RuntimeAttribute errors on Windows
os.environ["FLAGS_use_mkldnn"] = "0"
os.environ["FLAGS_enable_pir_api"] = "0"
os.environ["PADDLE_DISABLE_MKLDNN"] = "1"

import easyocr
import requests
from PIL import Image

warnings.filterwarnings("ignore", message=".*pin_memory.*")

try:
    import cv2
    import numpy as np
except ImportError:
    cv2 = None
    np = None

try:
    from paddleocr import PaddleOCR
except ImportError:
    PaddleOCR = None

import threading

_ocr_engine = None
_paddle_ocr = None
_paddle_ocr_failed = False
_ocr_lock = threading.Lock()


def init_ocr() -> easyocr.Reader:
    """Initialize and return the OCR engine."""
    global _ocr_engine
    with _ocr_lock:
        if _ocr_engine is None:
            # EasyOCR initializes a Reader instance
            _ocr_engine = easyocr.Reader(['en'], gpu=False)
            print("[OK] EasyOCR engine initialized")
    return _ocr_engine


def get_ocr_engine() -> easyocr.Reader:
    """Get the existing OCR engine."""
    if _ocr_engine is None:
        raise RuntimeError("OCR engine not initialized. Did you start the server?")
    return _ocr_engine


def get_paddle_ocr():
    """Get or lazily initialize the PaddleOCR engine."""
    global _paddle_ocr, _paddle_ocr_failed

    if PaddleOCR is None:
        raise RuntimeError("PaddleOCR is not installed")

    if _paddle_ocr_failed:
        return None

    if _paddle_ocr is None:
        with _ocr_lock:
            # double check after acquiring lock
            if _paddle_ocr is None and not _paddle_ocr_failed:
                try:
                    print("[OCR] Loading PaddleOCR (first time, may download models)...")
                    _paddle_ocr = PaddleOCR(
                        use_angle_cls=True,
                        lang="en",
                        enable_mkldnn=False,
                    )
                    print("[OCR] PaddleOCR loaded successfully.")
                except Exception as exc:
                    print(f"[OCR] PaddleOCR failed to load: {exc}")
                    _paddle_ocr_failed = True
                    _paddle_ocr = None

    return _paddle_ocr


def _safe_remove(path: str) -> None:
    if path and os.path.exists(path):
        os.remove(path)


def _processed_path(image_path: str, suffix: str) -> str:
    base_path, extension = os.path.splitext(image_path)
    return f"{base_path}_{suffix}{extension}"


def preprocess_light(image_path: str) -> str:
    """Apply light preprocessing that preserves clean printed text."""
    if cv2 is None:
        return image_path

    image = cv2.imread(image_path)
    if image is None:
        return image_path

    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    gray = cv2.resize(gray, None, fx=1.5, fy=1.5, interpolation=cv2.INTER_CUBIC)
    denoised = cv2.fastNlMeansDenoising(gray, None, 5, 7, 21)

    processed_path = _processed_path(image_path, "light")
    cv2.imwrite(processed_path, denoised)
    return processed_path


def preprocess_heavy(image_path: str) -> str:
    """Apply heavier preprocessing for handwriting and low-quality scans."""
    if cv2 is None or np is None:
        return image_path

    image = cv2.imread(image_path)
    if image is None:
        return image_path

    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    gray = cv2.resize(gray, None, fx=2.0, fy=2.0, interpolation=cv2.INTER_CUBIC)
    denoised = cv2.fastNlMeansDenoising(gray, None, 10, 7, 21)

    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    enhanced = clahe.apply(denoised)

    binary = cv2.adaptiveThreshold(
        enhanced,
        255,
        cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv2.THRESH_BINARY,
        11,
        2,
    )

    coords = np.column_stack(np.where(binary > 0))
    if len(coords) > 0:
        angle = cv2.minAreaRect(coords)[-1]
        if angle < -45:
            angle = -(90 + angle)
        else:
            angle = -angle

        if abs(angle) > 0.5:
            height, width = binary.shape[:2]
            center = (width // 2, height // 2)
            matrix = cv2.getRotationMatrix2D(center, angle, 1.0)
            binary = cv2.warpAffine(
                binary,
                matrix,
                (width, height),
                flags=cv2.INTER_CUBIC,
                borderMode=cv2.BORDER_REPLICATE,
            )

    processed_path = _processed_path(image_path, "heavy")
    cv2.imwrite(processed_path, binary)
    return processed_path


def preprocess_medical_image(image_path: str) -> str:
    """Backward-compatible alias for the lighter preprocessing path."""
    return preprocess_light(image_path)


def _cleanup_temp_file(path: str, original_path: str) -> None:
    if path and path != original_path and os.path.exists(path):
        os.remove(path)


def _extract_easyocr_text(image_path: str) -> dict:
    engine = get_ocr_engine()
    raw_results = engine.readtext(image_path, detail=1, paragraph=False)

    text_items = []
    confidences = []

    for bbox, text, confidence in raw_results:
        if text:
            text_items.append(text)
        if confidence is not None:
            confidences.append(float(confidence))

    full_text = " ".join(text_items).strip()
    average_confidence = sum(confidences) / len(confidences) if confidences else 0.0

    return {
        "text": full_text,
        "confidence": round(average_confidence, 2),
        "is_reliable": average_confidence >= 0.65 and bool(full_text),
        "engine": "easyocr",
        "word_count": len(text_items),
    }


def _parse_paddle_results(result) -> tuple:
    """Parse PaddleOCR results robustly across different versions/formats.

    PaddleOCR returns different structures depending on the version:
      - Classic: [[bbox, (text, confidence)], ...]
      - PP-OCRv5 / PaddleX dict style: [{"text": ..., "score": ..., "rec_boxes": ...}, ...]
      - Nested list style: [[ [bbox, (text, confidence)], ...]]

    Returns (texts, confidences) lists.
    """
    texts = []
    confidences = []

    if not result:
        return texts, confidences

    # Flatten: result is usually a list of pages; unwrap one level if needed
    items = result
    if isinstance(result, list) and len(result) > 0:
        first = result[0]
        # If the first element is itself a list of lines, unwrap page level
        if isinstance(first, list):
            items = first
        # If result is a list of dicts (PaddleX style), keep as-is
        elif isinstance(first, dict):
            items = result

    for line in items:
        if not line:
            continue

        try:
            # Format 1: dict with "text"/"rec_text" and "score"/"rec_score" keys (PaddleX / PP-OCRv5)
            if isinstance(line, dict):
                text = line.get("text") or line.get("rec_text") or ""
                confidence = line.get("score") or line.get("rec_score") or line.get("confidence") or 0.0
                if text:
                    texts.append(str(text))
                    confidences.append(float(confidence))
                continue

            # Format 2: classic tuple/list — [bbox, (text, confidence)]
            if isinstance(line, (list, tuple)) and len(line) >= 2:
                text_part = line[1]

                # text_part can be (text, confidence) or [text, confidence]
                if isinstance(text_part, (list, tuple)) and len(text_part) >= 2:
                    text, confidence = text_part[0], text_part[1]
                elif isinstance(text_part, dict):
                    text = text_part.get("text") or text_part.get("rec_text") or ""
                    confidence = text_part.get("score") or text_part.get("rec_score") or 0.0
                elif isinstance(text_part, str):
                    text = text_part
                    confidence = line[2] if len(line) > 2 else 0.0
                else:
                    continue

                if text:
                    texts.append(str(text))
                    confidences.append(float(confidence))
                continue

        except (ValueError, TypeError, IndexError) as e:
            print(f"[PaddleOCR] Could not parse line: {line!r} — {e}")
            continue

    return texts, confidences


def extract_with_paddle(image_path: str) -> dict:
    """Extract text using PaddleOCR as the handwriting-friendly fallback."""
    ocr = get_paddle_ocr()

    if ocr is None:
        print("[PaddleOCR] Skipped — engine failed to initialize.")
        return {
            "text": "",
            "confidence": 0.0,
            "is_reliable": False,
            "engine": "paddleocr",
            "word_count": 0,
            "warning": "PaddleOCR unavailable",
        }

    try:
        result = ocr.ocr(image_path)

        # Debug: log the raw structure so we can diagnose format issues
        if result:
            sample = result[0] if isinstance(result, list) and result else result
            if isinstance(sample, list) and sample:
                print(f"[PaddleOCR] Raw result[0] type: {type(sample).__name__}, "
                      f"first element type: {type(sample[0]).__name__}, count: {len(sample)}")
                # Print first element for format diagnosis
                try:
                    print(f"[PaddleOCR] Sample element: {repr(sample[0])[:300]}")
                except Exception:
                    pass
            elif isinstance(sample, dict):
                print(f"[PaddleOCR] Raw result type: dict, keys: {list(sample.keys())}")
            else:
                print(f"[PaddleOCR] Raw result type: {type(result).__name__}, value: {repr(result)[:200]}")
        else:
            print(f"[PaddleOCR] Raw result is empty/None: {result!r}")

        texts, confidences = _parse_paddle_results(result)

        full_text = " ".join(texts).strip()
        average_confidence = sum(confidences) / len(confidences) if confidences else 0.0

        print(f"[PaddleOCR] Extracted {len(texts)} text segments, confidence: {average_confidence:.2f}")

        return {
            "text": full_text,
            "confidence": round(average_confidence, 2),
            "is_reliable": average_confidence >= 0.65 and bool(full_text),
            "engine": "paddleocr",
            "word_count": len(texts),
        }
    except Exception as exc:
        import traceback
        print(f"[PaddleOCR] Runtime error: {exc}")
        traceback.print_exc()
        return {
            "text": "",
            "confidence": 0.0,
            "is_reliable": False,
            "engine": "paddleocr",
            "word_count": 0,
            "error": str(exc),
        }


def extract_with_paddleocr(image_path: str) -> dict:
    """Compatibility alias for the PaddleOCR extraction helper."""
    return extract_with_paddle(image_path)


def extract_text_hybrid(image_path: str) -> dict:
    """Extract text with dual-engine comparison across original, light, and heavy variants."""
    return extract_text_best(image_path)


def extract_text_best(image_path: str) -> dict:
    """Run EasyOCR on a light-preprocessed image; only fall back to PaddleOCR
    if EasyOCR confidence is below the early-exit threshold (0.80).

    Flow:
        1. Preprocess once (light).
        2. EasyOCR on light image → if confidence ≥ 0.80, return immediately.
        3. Otherwise, run PaddleOCR on the same light image.
        4. Compare both results, pick the winner.
    """
    EARLY_EXIT_THRESHOLD = 0.80
    print(f"[OCR] Processing: {os.path.basename(image_path)}")

    processed_path = preprocess_light(image_path)

    try:
        with _ocr_lock:
            # --- Pass 1: EasyOCR ---
            easy_result = _extract_easyocr_text(processed_path)
            easy_result["engine"] = "easyocr"
            easy_result["variant"] = "light"
            print(f"[OCR] EasyOCR light: {easy_result['confidence']:.2f}")

            # Fast path — high-confidence printed report
            if easy_result["confidence"] >= EARLY_EXIT_THRESHOLD:
                print(f"[OCR] EasyOCR confidence ≥ {EARLY_EXIT_THRESHOLD} — returning early (1 pass).")
                best_result = easy_result
            else:
                # --- Pass 2: PaddleOCR fallback ---
                paddle_ocr = get_paddle_ocr()
                if paddle_ocr is None:
                    print("[OCR] PaddleOCR unavailable — using EasyOCR result.")
                    best_result = easy_result
                else:
                    paddle_result = extract_with_paddle(processed_path)
                    paddle_result["engine"] = "paddleocr"
                    paddle_result["variant"] = "light"
                    print(f"[OCR] PaddleOCR light: {paddle_result['confidence']:.2f}")

                    best_result = max(
                        [easy_result, paddle_result],
                        key=lambda r: (r.get("confidence", 0.0), r.get("word_count", 0)),
                    )

            print(f"[OCR] Winner: {best_result.get('engine')} ({best_result.get('variant')}) conf={best_result.get('confidence', 0.0):.2f}")

            best_result["is_reliable"] = best_result.get("confidence", 0.0) >= 0.65 and bool(best_result.get("text", "").strip())

            if not best_result["is_reliable"]:
                best_result["warning"] = "Low confidence on OCR output. Please review extracted text before saving."

            return best_result
    finally:
        _cleanup_temp_file(processed_path, image_path)


def extract_text(image_path: str) -> str:
    """
    Extract text from an image file.
    
    Args:
        image_path: Path to image file
        
    Returns:
        Extracted text
    """
    return extract_text_hybrid(image_path)["text"]


def extract_text_with_confidence(image_path: str) -> list:
    """
    Extract text with confidence scores.
    
    Args:
        image_path: Path to image file
        
    Returns:
        List of {'text': str, 'confidence': float, 'bbox': list}
    """
    with _ocr_lock:
        engine = get_ocr_engine()
        raw_results = engine.readtext(image_path)
        
        text_items = []
        for bbox, text, confidence in raw_results:
            text_items.append({
                'text': text,
                'confidence': float(confidence),
                'bbox': [[int(coord) for coord in pt] for pt in bbox]
            })
        return text_items


def download_file(url: str) -> bytes:
    response = requests.get(url, timeout=30)
    response.raise_for_status()
    return response.content


def extract_text_from_image(image_bytes: bytes) -> str:
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    
    with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as tmp:
        image.save(tmp.name)
        tmp_path = tmp.name
    
    try:
        return extract_text_hybrid(tmp_path)["text"]
    finally:
        os.unlink(tmp_path)


def extract_text_from_url(file_url: str) -> str:
    file_bytes = download_file(file_url)
    return extract_text_from_image(file_bytes)