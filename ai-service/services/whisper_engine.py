"""
Whisper Speech-to-Text Model Singleton
Loads the faster-whisper model once at startup.
"""

import faster_whisper
from config import WHISPER_MODEL, WHISPER_DEVICE

_whisper_model: faster_whisper.WhisperModel = None


def init_whisper() -> faster_whisper.WhisperModel:
    """Initialize and return the Whisper model."""
    global _whisper_model
    
    if _whisper_model is None:
        _whisper_model = faster_whisper.WhisperModel(
            WHISPER_MODEL,
            device=WHISPER_DEVICE,
            compute_type="int8" if WHISPER_DEVICE == "cpu" else "float16"
        )
        print(f"✓ Whisper model initialized: {WHISPER_MODEL} (device: {WHISPER_DEVICE})")
    
    return _whisper_model


def get_whisper_model() -> faster_whisper.WhisperModel:
    """Get the existing Whisper model."""
    if _whisper_model is None:
        raise RuntimeError("Whisper model not initialized. Did you start the server?")
    return _whisper_model


def transcribe(audio_path: str) -> str:
    """
    Transcribe audio file to text.
    
    Args:
        audio_path: Path to audio file
        
    Returns:
        Transcribed text
    """
    model = get_whisper_model()
    segments, info = model.transcribe(audio_path, language="en")
    text = " ".join([segment.text for segment in segments])
    return text.strip()


def transcribe_stream(audio_bytes: bytes) -> str:
    """
    Transcribe audio from bytes.
    
    Args:
        audio_bytes: Audio data as bytes
        
    Returns:
        Transcribed text
    """
    import tempfile
    
    # Write bytes to temporary file
    with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp:
        tmp.write(audio_bytes)
        tmp_path = tmp.name
    
    try:
        return transcribe(tmp_path)
    finally:
        import os
        os.unlink(tmp_path)
