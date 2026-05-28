"""
File Download Utility
Downloads files from URLs (Cloudinary, etc.) and handles format conversion.
Supports images and PDFs with automatic conversion.
"""

import os
import tempfile
import requests
from pathlib import Path
from typing import Tuple, Optional
from PIL import Image
import io

# Try to import pdf2image (optional for PDF support)
try:
    from pdf2image import convert_from_bytes
    PDF_SUPPORT = True
except ImportError:
    PDF_SUPPORT = False
    print("[WARN] pdf2image not installed. PDF support disabled.")
    print("   Install with: pip install pdf2image python-pptx")


def download_file(url: str, timeout: int = 30) -> Tuple[bytes, str]:
    """
    Download a file from URL and return bytes + file extension.
    
    Args:
        url: URL to download from
        timeout: Download timeout in seconds
        
    Returns:
        Tuple of (file_bytes, file_extension)
        
    Raises:
        requests.RequestException: If download fails
        ValueError: If URL is invalid
    """
    if not url.startswith(('http://', 'https://')):
        raise ValueError(f"Invalid URL: {url}")
    
    try:
        response = requests.get(url, timeout=timeout, stream=True)
        response.raise_for_status()
        
        # Get file extension from content-type or URL
        content_type = response.headers.get('content-type', '').lower()
        
        if 'pdf' in content_type or url.lower().endswith('.pdf'):
            extension = '.pdf'
        elif 'image/png' in content_type or url.lower().endswith('.png'):
            extension = '.png'
        elif 'image/jpeg' in content_type or 'image/jpg' in content_type or url.lower().endswith(('.jpg', '.jpeg')):
            extension = '.jpg'
        elif 'image/webp' in content_type or url.lower().endswith('.webp'):
            extension = '.webp'
        elif 'image/gif' in content_type or url.lower().endswith('.gif'):
            extension = '.gif'
        else:
            # Default to jpg for images
            extension = '.jpg'
        
        file_bytes = response.content
        
        if not file_bytes:
            raise ValueError("Downloaded file is empty")
        
        return file_bytes, extension
    
    except requests.Timeout:
        raise requests.RequestException(f"Download timeout for URL: {url}")
    except requests.RequestException as e:
        raise requests.RequestException(f"Failed to download {url}: {e}")


def save_to_temp_file(file_bytes: bytes, extension: str) -> str:
    """
    Save bytes to a temporary file.
    
    Args:
        file_bytes: File data as bytes
        extension: File extension (e.g., '.jpg', '.pdf')
        
    Returns:
        Path to temporary file (caller must cleanup)
    """
    with tempfile.NamedTemporaryFile(delete=False, suffix=extension) as tmp:
        tmp.write(file_bytes)
        return tmp.name


def pdf_to_images(pdf_bytes: bytes, dpi: int = 200) -> list:
    """
    Convert PDF bytes to list of PIL Images.
    
    Args:
        pdf_bytes: PDF file as bytes
        dpi: DPI for PDF conversion (higher = better quality, slower)
        
    Returns:
        List of PIL Image objects (one per page)
        
    Raises:
        ImportError: If pdf2image not installed
        ValueError: If PDF conversion fails
    """
    if not PDF_SUPPORT:
        raise ImportError(
            "pdf2image not installed. Install with: "
            "pip install pdf2image"
        )
    
    try:
        images = convert_from_bytes(pdf_bytes, dpi=dpi)
        if not images:
            raise ValueError("PDF conversion produced no images")
        return images
    except Exception as e:
        raise ValueError(f"Failed to convert PDF: {e}")


def convert_pdf_to_image(pdf_bytes: bytes, page: int = 0) -> Tuple[bytes, str]:
    """
    Convert first page of PDF to image bytes.
    
    Args:
        pdf_bytes: PDF file as bytes
        page: Page number (0-indexed, default first page)
        
    Returns:
        Tuple of (image_bytes, extension)
    """
    images = pdf_to_images(pdf_bytes)
    
    if page >= len(images):
        page = len(images) - 1
    
    image = images[page]
    
    # Convert PIL image to bytes
    img_byte_arr = io.BytesIO()
    image.save(img_byte_arr, format='JPEG')
    
    return img_byte_arr.getvalue(), '.jpg'


def download_and_convert(url: str, convert_pdf: bool = True) -> Tuple[str, str]:
    """
    Download file from URL and convert to image if needed.
    
    Args:
        url: URL to download from
        convert_pdf: If True, convert PDFs to images
        
    Returns:
        Tuple of (temp_file_path, actual_extension)
    """
    # Download file
    file_bytes, extension = download_file(url)
    
    # If PDF and conversion requested, convert to image
    if extension == '.pdf' and convert_pdf:
        try:
            file_bytes, extension = convert_pdf_to_image(file_bytes)
        except ImportError as e:
            # Fallback: save as-is if conversion not available
            print(f"[WARN] {e}")
            print("    Saving PDF as-is (OCR may fail)")
    
    # Save to temp file
    temp_path = save_to_temp_file(file_bytes, extension)
    
    return temp_path, extension


def get_file_info(url: str) -> dict:
    """
    Get file information without downloading entire file.
    
    Args:
        url: URL to check
        
    Returns:
        Dict with file info: size, content_type, extension
    """
    try:
        response = requests.head(url, timeout=10, allow_redirects=True)
        response.raise_for_status()
        
        content_type = response.headers.get('content-type', 'unknown')
        content_length = int(response.headers.get('content-length', 0))
        
        return {
            "url": url,
            "content_type": content_type,
            "size_bytes": content_length,
            "size_mb": round(content_length / (1024 * 1024), 2),
        }
    except Exception as e:
        return {
            "url": url,
            "error": str(e)
        }


def cleanup_temp_file(file_path: str) -> bool:
    """
    Clean up a temporary file.
    
    Args:
        file_path: Path to temporary file
        
    Returns:
        True if successful, False otherwise
    """
    try:
        if os.path.exists(file_path):
            os.unlink(file_path)
            return True
        return False
    except Exception as e:
        print(f"[WARN] Failed to cleanup {file_path}: {e}")
        return False


class FileDownloadContext:
    """
    Context manager for safe file downloads and cleanup.
    
    Usage:
        with FileDownloadContext('https://example.com/image.jpg') as (path, ext):
            process_file(path)
        # Automatically cleaned up
    """
    
    def __init__(self, url: str, convert_pdf: bool = True):
        self.url = url
        self.convert_pdf = convert_pdf
        self.temp_path = None
    
    def __enter__(self) -> Tuple[str, str]:
        """Download file and return path, extension"""
        self.temp_path, extension = download_and_convert(
            self.url,
            convert_pdf=self.convert_pdf
        )
        return self.temp_path, extension
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        """Clean up temporary file"""
        if self.temp_path:
            cleanup_temp_file(self.temp_path)
        return False
