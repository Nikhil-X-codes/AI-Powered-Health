import os
from dotenv import load_dotenv

load_dotenv()

# API Configuration
API_HOST = os.getenv("API_HOST", "0.0.0.0")
API_PORT = int(os.getenv("API_PORT", 8000))
API_WORKERS = int(os.getenv("API_WORKERS", 1))

# LLM Configuration
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
GROQ_MODEL = os.getenv("GROQ_MODEL", "mixtral-8x7b-32768")

# Embeddings Configuration
EMBEDDER_MODEL = os.getenv("EMBEDDER_MODEL", "BAAI/bge-small-en")

# ChromaDB Configuration
CHROMA_DATA_DIR = os.getenv("CHROMA_DATA_DIR", "./chroma_data")
CHROMA_COLLECTION_NAME = os.getenv("CHROMA_COLLECTION_NAME", "medical_knowledge")
CHROMA_DISTANCE_METRIC = os.getenv("CHROMA_DISTANCE_METRIC", "cosine")

# Whisper Configuration
WHISPER_MODEL = os.getenv("WHISPER_MODEL", "base")
WHISPER_DEVICE = os.getenv("WHISPER_DEVICE", "cpu")

# OCR Configuration
OCR_LANGUAGE = os.getenv("OCR_LANGUAGE", "en")

# CORS Configuration
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://localhost:3001").split(",")
CORS_ALLOW_CREDENTIALS = os.getenv("CORS_ALLOW_CREDENTIALS", "true").lower() == "true"
CORS_ALLOW_METHODS = ["*"]
CORS_ALLOW_HEADERS = ["*"]

# Validation
if not GROQ_API_KEY:
    print("WARNING: GROQ_API_KEY not set. LLM features will fail.")
