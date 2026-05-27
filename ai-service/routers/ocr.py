"""
OCR Router
Endpoints for document text extraction from files or URLs.
"""

from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel
from typing import Optional
import tempfile
import os
from services import get_ocr_engine, extract_text, extract_text_with_confidence
from utils import download_and_convert, FileDownloadContext, cleanup_temp_file

router = APIRouter(prefix="/ocr", tags=["OCR"])

class OCRRequest(BaseModel):
    file_url: str
    description: Optional[str] = None


@router.post("/extract")
async def extract_from_image(file: UploadFile = File(...)):
    """
    Extract text from an uploaded image.
    
    Returns:
        {
            "text": "extracted text",
            "filename": "image.png"
        }
    """
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    # Save uploaded file temporarily
    with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[1]) as tmp:
        content = await file.read()
        tmp.write(content)
        tmp_path = tmp.name
    
    try:
        text = extract_text(tmp_path)
        return {
            "text": text,
            "filename": file.filename
        }
    finally:
        os.unlink(tmp_path)


@router.post("/extract-detailed")
async def extract_detailed(file: UploadFile = File(...)):
    """
    Extract text with confidence scores and bounding boxes.
    """
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[1]) as tmp:
        content = await file.read()
        tmp.write(content)
        tmp_path = tmp.name
    
    try:
        items = extract_text_with_confidence(tmp_path)
        return {
            "items": items,
            "filename": file.filename,
            "total_items": len(items)
        }
    finally:
        os.unlink(tmp_path)


@router.post("/from-url")
async def extract_from_url(request: OCRRequest):
    """
    Download file from URL (Cloudinary, S3, etc.) and extract text.
    Handles PDFs automatically by converting to image.
    
    Request:
        {
            "file_url": "https://cloudinary.com/prescription.pdf",
            "description": "Patient blood test report"
        }
    
    Returns:
        {
            "text": "extracted text",
            "source": "cloudinary.com",
            "description": "Patient blood test report"
        }
    """
    try:
        # Download and auto-convert PDF to image if needed
        with FileDownloadContext(request.file_url, convert_pdf=True) as (temp_path, ext):
            text = extract_text(temp_path)
            
            if not text.strip():
                raise HTTPException(
                    status_code=400,
                    detail="Could not extract text from file"
                )
            
            return {
                "text": text,
                "source": request.file_url.split('/')[2],  # Extract domain
                "description": request.description,
                "status": "success"
            }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to extract text: {str(e)}"
        )
