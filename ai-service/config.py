import os
from dotenv import load_dotenv

ENVIRONMENT = os.getenv("ENVIRONMENT", "development")
if ENVIRONMENT == "development":
    load_dotenv()

def require_env(key):
    """Crash immediately if a required variable is missing."""
    value = os.getenv(key)
    if not value:
        raise RuntimeError(f"Required environment variable '{key}' is not set. Check your .env file.")
    return value


API_HOST = os.getenv("API_HOST", "0.0.0.0")
API_PORT = int(os.getenv("API_PORT") or os.getenv("AI_SERVICE_PORT") or 8000)
API_WORKERS = int(os.getenv("API_WORKERS", 1))


GROQ_API_KEY = require_env("GROQ_API_KEY")
GROQ_MODEL = os.getenv("GROQ_MODEL", "mixtral-8x7b-32768")

EMBEDDER_MODEL = os.getenv("EMBEDDER_MODEL") or os.getenv("EMBEDDING_MODEL") or "BAAI/bge-small-en"


CHROMA_DATA_DIR = os.getenv("CHROMA_DATA_DIR") or os.getenv("CHROMA_DB_PATH") or "./chroma_db"
CHROMA_COLLECTION_NAME = os.getenv("CHROMA_COLLECTION_NAME") or os.getenv("CHROMA_COLLECTION") or "prescriptions"
CHROMA_DISTANCE_METRIC = os.getenv("CHROMA_DISTANCE_METRIC", "cosine")

# ── Whisper Configuration ──
# Your .env uses WHISPER_MODEL_SIZE, config uses WHISPER_MODEL
WHISPER_MODEL = os.getenv("WHISPER_MODEL") or os.getenv("WHISPER_MODEL_SIZE") or "base"
WHISPER_DEVICE = os.getenv("WHISPER_DEVICE", "cpu")

# ── TTS Configuration ──
TTS_VOICE = os.getenv("TTS_VOICE", "en-US-AriaNeural")

# ── OCR Configuration ──
OCR_LANGUAGE = os.getenv("OCR_LANGUAGE", "en")

# ── CORS Configuration ──
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://localhost:3001").split(",")
CORS_ALLOW_CREDENTIALS = os.getenv("CORS_ALLOW_CREDENTIALS", "true").lower() == "true"
CORS_ALLOW_METHODS = ["*"]
CORS_ALLOW_HEADERS = ["*"]


print(f"✓ Config loaded — ENV: {ENVIRONMENT}, Model: {GROQ_MODEL}, Chroma: {CHROMA_COLLECTION_NAME}")