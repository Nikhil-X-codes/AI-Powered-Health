"""
Whisper Speech-to-Text Model Singleton
Loads the faster-whisper model once at startup only if needed.
Uses Groq Whisper API by default for fast, memoryless transcription.
"""

import os
from config import WHISPER_MODEL, WHISPER_DEVICE, WHISPER_CACHE_DIR, GROQ_API_KEY
from groq import Groq

_whisper_model = None


def init_whisper():
    """Initialize and return the Whisper model."""
    global _whisper_model
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
    if _whisper_model is None:
        init_whisper()
    return _whisper_model



def transcribe(audio_path: str) -> str:
    """
    Transcribe audio file to text.
    Uses Groq Whisper API by default, falling back to local Whisper.
    
    Args:
        audio_path: Path to audio file
        
    Returns:
        Transcribed text
    """
    # Use Groq API by default (saves hundreds of MBs of memory and is extremely fast)
    if GROQ_API_KEY:
        try:
            print(f"[Whisper] Transcribing {os.path.basename(audio_path)} via Groq API...")
            client = Groq(api_key=GROQ_API_KEY)
            with open(audio_path, "rb") as file:
                translation = client.audio.transcriptions.create(
                    file=(os.path.basename(audio_path), file.read()),
                    model="whisper-large-v3",
                    language="en"
                )
                return translation.text.strip()
        except Exception as e:
            print(f"[Whisper] Groq transcription failed: {e}. Falling back to local model...")

    # Local fallback
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
