"""
EasyOCR Engine Singleton
Loads the OCR model once at startup.
"""

import easyocr
import requests
import tempfile
import os
from PIL import Image
import io

_ocr_engine = None


def init_ocr() -> easyocr.Reader:
    """Initialize and return the OCR engine."""
    global _ocr_engine
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


def extract_text(image_path: str) -> str:
    """
    Extract text from an image file.
    
    Args:
        image_path: Path to image file
        
    Returns:
        Extracted text
    """
    engine = get_ocr_engine()
    # detail=0 returns just a list of texts
    result = engine.readtext(image_path, detail=0, paragraph=True)
    return "\n".join(result)


def extract_text_with_confidence(image_path: str) -> list:
    """
    Extract text with confidence scores.
    
    Args:
        image_path: Path to image file
        
    Returns:
        List of {'text': str, 'confidence': float, 'bbox': list}
    """
    engine = get_ocr_engine()
    # default readtext returns (bbox, text, confidence)
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
        reader = get_ocr_engine()
        result = reader.readtext(tmp_path, detail=0, paragraph=True)
        return "\n".join(result)
    finally:
        os.unlink(tmp_path)


def extract_text_from_url(file_url: str) -> str:
    file_bytes = download_file(file_url)
    return extract_text_from_image(file_bytes)