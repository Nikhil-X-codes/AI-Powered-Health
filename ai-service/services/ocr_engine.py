"""
Google Cloud Vision OCR Engine
Only uses Google Vision API for text extraction.
"""

import io
import os
import tempfile
import requests
from PIL import Image
from google.cloud import vision

# Auto-locate google credentials if environment variable is not set or points to a non-existent file
import json

creds_json = os.environ.get("GOOGLE_CREDENTIALS_JSON") or os.environ.get("GOOGLE_APPLICATION_CREDENTIALS_JSON")
if creds_json:
    try:
        # Validate that it is valid JSON
        json.loads(creds_json)
        # Write to a temporary file
        temp_dir = tempfile.gettempdir()
        temp_cred_path = os.path.join(temp_dir, "google-credentials.json")
        with open(temp_cred_path, "w", encoding="utf-8") as f:
            f.write(creds_json)
        os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = temp_cred_path
        print(f"[Vision API] Successfully created credentials file from env var at {temp_cred_path}")
    except Exception as e:
        print(f"[Vision API] Failed to parse GOOGLE_CREDENTIALS_JSON: {e}")

creds_env = os.environ.get("GOOGLE_APPLICATION_CREDENTIALS")
if not creds_env or not os.path.exists(creds_env):
    current_dir = os.path.dirname(os.path.abspath(__file__))  # services
    ai_service_dir = os.path.dirname(current_dir)  # ai-service
    
    # Try both double extension name and standard name
    for name in ["google-credentials.json.json", "google-credentials.json"]:
        candidate = os.path.join(ai_service_dir, name)
        if os.path.exists(candidate):
            os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = candidate
            print(f"[Vision API] Set GOOGLE_APPLICATION_CREDENTIALS to {candidate}")
            break


def init_ocr():
    """Verify that Google Vision Client can be initialized."""
    try:
        client = vision.ImageAnnotatorClient()
        print("[OK] Google Vision API engine initialized")
        return client
    except Exception as e:
        print(f"[ERROR] Failed to initialize Google Vision Client: {e}")
        raise


def get_ocr_engine():
    """Get the Google Vision client instance."""
    return vision.ImageAnnotatorClient()


def extract_text_hybrid(image_path: str) -> dict:
    """
    Extract text using Google Vision API document_text_detection.
    """
    print(f"[Vision API] Processing with Google Vision: {os.path.basename(image_path)}")
    try:
        client = vision.ImageAnnotatorClient()
        with io.open(image_path, 'rb') as image_file:
            content = image_file.read()
            
        image = vision.Image(content=content)
        response = client.document_text_detection(image=image)
        
        if response.error.message:
            raise RuntimeError(f"Google Vision API error: {response.error.message}")
            
        annotation = response.full_text_annotation
        text = annotation.text if annotation else ""
        
        # Calculate confidence (average of all word confidences)
        confidences = []
        if annotation:
            for page in annotation.pages:
                for block in page.blocks:
                    for paragraph in block.paragraphs:
                        for word in paragraph.words:
                            if word.confidence is not None:
                                confidences.append(word.confidence)
                                
        confidence = sum(confidences) / len(confidences) if confidences else 0.0
        confidence = round(confidence, 2)
        
        # Determine if reliable (confidence threshold is 0.70)
        is_reliable = confidence >= 0.70 and bool(text.strip())
        
        return {
            "text": text,
            "confidence": confidence,
            "is_reliable": is_reliable,
            "engine": "google_vision"
        }
    except Exception as e:
        print(f"[Vision API] Google Vision extraction error: {e}")
        raise RuntimeError(f"Google Vision API failure: {str(e)}")



def extract_text(image_path: str) -> str:
    """Extract and return text string from image path."""
    return extract_text_hybrid(image_path)["text"]


def extract_text_with_confidence(image_path: str) -> list:
    """
    Extract text with detailed word-level confidence and bounding boxes using Google Vision.
    """
    try:
        client = vision.ImageAnnotatorClient()
        with io.open(image_path, 'rb') as image_file:
            content = image_file.read()
            
        image = vision.Image(content=content)
        response = client.document_text_detection(image=image)
        
        if response.error.message:
            raise RuntimeError(f"Google Vision API error: {response.error.message}")
            
        annotation = response.full_text_annotation
        if not annotation:
            return []
            
        items = []
        for page in annotation.pages:
            for block in page.blocks:
                for paragraph in block.paragraphs:
                    for word in paragraph.words:
                        word_text = "".join([symbol.text for symbol in word.symbols])
                        bbox = []
                        if word.bounding_box and word.bounding_box.vertices:
                            bbox = [[v.x, v.y] for v in word.bounding_box.vertices]
                        
                        items.append({
                            'text': word_text,
                            'confidence': float(word.confidence) if word.confidence is not None else 0.0,
                            'bbox': bbox
                        })
        return items
    except Exception as e:
        print(f"[Vision API] Google Vision detailed extraction error: {e}")
        raise RuntimeError(f"Google Vision API failure: {str(e)}")


def extract_with_paddle(image_path: str) -> dict:
    """Deprecated: PaddleOCR is removed. Raises NotImplementedError."""
    raise NotImplementedError("PaddleOCR has been removed. Use Google Vision instead.")


def extract_text_from_image(image_bytes: bytes) -> str:
    """Convert bytes to Image, save to temp file, and extract text."""
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as tmp:
        image.save(tmp.name)
        tmp_path = tmp.name
    try:
        return extract_text_hybrid(tmp_path)["text"]
    finally:
        if os.path.exists(tmp_path):
            os.unlink(tmp_path)


def download_file(url: str) -> bytes:
    """Download file from URL."""
    response = requests.get(url, timeout=30)
    response.raise_for_status()
    return response.content


def extract_text_from_url(file_url: str) -> str:
    """Download file and extract text."""
    file_bytes = download_file(file_url)
    return extract_text_from_image(file_bytes)