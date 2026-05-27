"""
PaddleOCR Engine Singleton
Loads the OCR model once at startup.
"""

from paddleocr import PaddleOCR
from config import OCR_LANGUAGE

_ocr_engine: PaddleOCR = None


def init_ocr() -> PaddleOCR:
    """Initialize and return the OCR engine."""
    global _ocr_engine
    
    if _ocr_engine is None:
        _ocr_engine = PaddleOCR(
            use_angle_cls=True,
            lang=OCR_LANGUAGE,
            device='cpu'
        )
        print(f"✓ PaddleOCR engine initialized (language: {OCR_LANGUAGE})")
    
    return _ocr_engine


def get_ocr_engine() -> PaddleOCR:
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
    result = engine.ocr(image_path, cls=True)
    
    # Extract text from result (list of lines, each line contains bboxes)
    text = "\n".join([
        "".join([item[1][0] for item in line])
        for line in result
    ])
    
    return text


def extract_text_with_confidence(image_path: str) -> list:
    """
    Extract text with confidence scores.
    
    Args:
        image_path: Path to image file
        
    Returns:
        List of {'text': str, 'confidence': float}
    """
    engine = get_ocr_engine()
    result = engine.ocr(image_path, cls=True)
    
    text_items = []
    for line in result:
        for item in line:
            bbox, (text, confidence) = item
            text_items.append({
                'text': text,
                'confidence': float(confidence),
                'bbox': bbox
            })
    
    return text_items
