"""
OCR Router
Endpoints for document text extraction from files or URLs.
"""

from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.concurrency import run_in_threadpool
from pydantic import BaseModel
from typing import Optional
import tempfile
import os
from services import extract_text_hybrid, extract_text_with_confidence
from utils import FileDownloadContext

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
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    # Save uploaded file temporarily
    with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[1]) as tmp:
        content = await file.read()
        tmp.write(content)
        tmp_path = tmp.name
    
    try:
        result = await run_in_threadpool(extract_text_hybrid, tmp_path)
        return {
            "text": result["text"],
            "confidence": result["confidence"],
            "is_reliable": result["is_reliable"],
            "engine": result["engine"],
            "warning": result.get("warning"),
            "filename": file.filename
        }
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=f"OCR service unavailable: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OCR extraction failed: {str(e)}")
    finally:
        os.unlink(tmp_path)


@router.post("/extract-detailed")
async def extract_detailed(file: UploadFile = File(...)):
    """
    Extract text with confidence scores and bounding boxes.
    """
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[1]) as tmp:
        content = await file.read()
        tmp.write(content)
        tmp_path = tmp.name
    
    try:
        items = await run_in_threadpool(extract_text_with_confidence, tmp_path)
        return {
            "items": items,
            "filename": file.filename,
            "total_items": len(items)
        }
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=f"OCR service unavailable: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OCR extraction failed: {str(e)}")
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
            "confidence": 0.87,
            "is_reliable": true,
            "engine": "google_vision",
            "source": "cloudinary.com",
            "description": "Patient blood test report",
            "status": "success"
        }
    """
    try:
        # Download and auto-convert PDF to image if needed
        with FileDownloadContext(request.file_url, convert_pdf=True) as (temp_path, _ext):
            result = await run_in_threadpool(extract_text_hybrid, temp_path)

            if not result["text"].strip():
                raise HTTPException(
                    status_code=400,
                    detail="Could not extract text from file"
                )
            
            return {
                "text": result["text"],
                "confidence": result["confidence"],
                "is_reliable": result["is_reliable"],
                "engine": result["engine"],
                "warning": result.get("warning"),
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
