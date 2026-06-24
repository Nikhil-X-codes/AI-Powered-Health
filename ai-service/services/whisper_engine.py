"""
Whisper Speech-to-Text Engine
Uses Groq Whisper API in production (zero RAM overhead).
Falls back to local faster-whisper model in development.
"""

import os
from config import WHISPER_MODEL, WHISPER_DEVICE, WHISPER_CACHE_DIR, GROQ_API_KEY

ENVIRONMENT = os.getenv("ENVIRONMENT", "development")

_whisper_model = None


def init_whisper():
    """Initialize and return the local Whisper model (development only)."""
    global _whisper_model
    if ENVIRONMENT == "production":
        print("[OK] Whisper using Groq API (no local model needed)")
        return None
    import faster_whisper

    if _whisper_model is None:
        model_kwargs = {
            "device": WHISPER_DEVICE,
            "compute_type": "int8" if WHISPER_DEVICE == "cpu" else "float16",
        }
        if WHISPER_CACHE_DIR:
            os.makedirs(WHISPER_CACHE_DIR, exist_ok=True)
            model_kwargs["download_root"] = WHISPER_CACHE_DIR

        _whisper_model = faster_whisper.WhisperModel(
            WHISPER_MODEL,
            **model_kwargs,
        )
        cache_note = f", cache: {WHISPER_CACHE_DIR}" if WHISPER_CACHE_DIR else ""
        print(f"[OK] Whisper model initialized: {WHISPER_MODEL} (device: {WHISPER_DEVICE}{cache_note})")

    return _whisper_model


def get_whisper_model():
    """Get the existing Whisper model, initializing it if necessary."""
    global _whisper_model
    if ENVIRONMENT == "production":
        return None
    if _whisper_model is None:
        init_whisper()
    return _whisper_model


def _transcribe_groq(audio_path: str) -> str:
    """Transcribe audio using Groq's Whisper API."""
    from groq import Groq

    print(f"[Whisper] Transcribing {os.path.basename(audio_path)} via Groq API...")
    client = Groq(api_key=GROQ_API_KEY)
    with open(audio_path, "rb") as file:
        result = client.audio.transcriptions.create(
            file=(os.path.basename(audio_path), file.read()),
            model="whisper-large-v3",
            language="en",
        )
    return result.text.strip()


def transcribe(audio_path: str) -> str:
    """
    Transcribe audio file to text.
    Uses Groq Whisper API in production, local model in development.

    Args:
        audio_path: Path to audio file

    Returns:
        Transcribed text
    """
    # Always try Groq API first if key is available
    if GROQ_API_KEY:
        try:
            return _transcribe_groq(audio_path)
        except Exception as e:
            print(f"[Whisper] Groq transcription failed: {e}")
            if ENVIRONMENT == "production":
                raise RuntimeError(f"Groq Whisper API failed: {e}")
            print("[Whisper] Falling back to local model...")

    # Local fallback (development only)
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
        os.unlink(tmp_path)
