"""
Services Package
Exports all singleton service loaders.
"""

# Service initialization functions
from .groq_client import init_groq_client, get_groq_client
from .embedder import init_embedder, get_embedder, embed_text, embed_texts
from .chroma_store import init_chroma, get_collection, add_documents, search
from .whisper_engine import init_whisper, get_whisper_model, transcribe, transcribe_stream
from .tts_engine import synthesize_speech
from .ocr_engine import (
    init_ocr,
    get_ocr_engine,
    extract_text,
    extract_text_with_confidence,
    extract_text_from_image,
    extract_text_from_url,
)

__all__ = [
    # Groq
    "init_groq_client",
    "get_groq_client",
    # Embedder
    "init_embedder",
    "get_embedder",
    "embed_text",
    "embed_texts",
    # ChromaDB
    "init_chroma",
    "get_collection",
    "add_documents",
    "search",
    # Whisper
    "init_whisper",
    "get_whisper_model",
    "transcribe",
    "transcribe_stream",
    # TTS
    "synthesize_speech",
    # OCR
    "init_ocr",
    "get_ocr_engine",
    "extract_text",
    "extract_text_with_confidence",
    "extract_text_from_image",
    "extract_text_from_url",
]
