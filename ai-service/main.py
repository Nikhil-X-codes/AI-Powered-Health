import os
import time

os.environ.setdefault("HF_HOME", "D:/Projects/Health/ai-service/models_cache/huggingface")
os.environ.setdefault("TRANSFORMERS_CACHE", "D:/Projects/Health/ai-service/models_cache/huggingface")
os.environ.setdefault("TORCH_HOME", "D:/Projects/Health/ai-service/models_cache/torch")
os.environ.setdefault("WHISPER_CACHE_DIR", "D:/Projects/Health/ai-service/models_cache/whisper")
os.environ.setdefault("XDG_CACHE_HOME", "D:/Projects/Health/ai-service/models_cache")

start_total = time.time()

# Now safe to import ML libraries
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import sys

import config
from services import (
    init_groq_client,
    init_embedder,
    init_chroma,
    init_whisper,
    init_ocr,
)
from routers import ocr, chat, embed, prescription, voice, analyze


# ============================================================================
# STARTUP & SHUTDOWN EVENTS (Singleton Loaders)
# ============================================================================

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Manage app lifecycle: startup and shutdown.
    Fast startup; heavy ML models will be loaded dynamically on demand.
    """
    print("[STARTUP] Server lifespan started. Models will be loaded lazily on first request.")
    yield  # Server runs here
    # Add any cleanup code here (close connections, save state, etc.)



# ============================================================================
# FASTAPI APP SETUP
# ============================================================================

app = FastAPI(
    title="Health AI Service",
    description="Medical AI pipelines: OCR, RAG, Chat, Voice, Analysis",
    version="1.0.0",
    lifespan=lifespan,
)


# ============================================================================
# CORS MIDDLEWARE
# ============================================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=config.CORS_ORIGINS,
    allow_credentials=config.CORS_ALLOW_CREDENTIALS,
    allow_methods=config.CORS_ALLOW_METHODS,
    allow_headers=config.CORS_ALLOW_HEADERS,
)


# ============================================================================
# HEALTH CHECK ENDPOINT
# ============================================================================


@app.head("/health")
@app.get("/health", tags=["Health"])
async def health_check():
    """
    Health check endpoint.
    Used by load balancers and monitoring to verify service is alive.
    """
    return {
        "status": "ok",
        "service": "medzee-ai",
        "version": "1.0.0"
    }



@app.get("/health/detailed", tags=["Health"])
async def health_check_detailed():
    """
    Detailed health check with service status.
    """
    status = {
        "service": "alive",
        "services": {}
    }
    
    # Check each service
    try:
        from services import get_groq_client
        get_groq_client()
        status["services"]["groq"] = "ok"
    except:
        status["services"]["groq"] = "error"
    
    try:
        from services import get_embedder
        get_embedder()
        status["services"]["embedder"] = "ok"
    except:
        status["services"]["embedder"] = "error"
    
    try:
        from services import get_collection
        get_collection()
        status["services"]["chromadb"] = "ok"
    except:
        status["services"]["chromadb"] = "error"
    
    try:
        from services import get_whisper_model
        get_whisper_model()
        status["services"]["whisper"] = "ok"
    except:
        status["services"]["whisper"] = "error"
    
    try:
        from services import get_ocr_engine
        get_ocr_engine()
        status["services"]["ocr"] = "ok"
    except:
        status["services"]["ocr"] = "error"
    
    return status


# ============================================================================
# MOUNT ROUTERS
# ============================================================================

app.include_router(ocr.router)
app.include_router(chat.router)
app.include_router(embed.router)
app.include_router(prescription.router)
app.include_router(voice.router)
app.include_router(analyze.router)


# ============================================================================
# ROOT ENDPOINT
# ============================================================================

@app.get("/", tags=["Info"])
async def root():
    """API documentation and available endpoints."""
    return {
        "service": "Health AI Service",
        "version": "1.0.0",
        "docs": "/docs",
        "openapi": "/openapi.json",
        "health": "/health",
        "endpoints": {
            "OCR": {
                "prefix": "/ocr",
                "POST /ocr/extract": "Extract text from image",
                "POST /ocr/extract-detailed": "Extract text with confidence scores",
            },
            "Chat": {
                "prefix": "/chat",
                "POST /chat/completions": "Multi-turn conversation",
                "POST /chat/quick": "Single question",
            },
            "Embeddings": {
                "prefix": "/embed",
                "POST /embed/single": "Embed single text",
                "POST /embed/batch": "Embed multiple texts",
            },
            "Prescriptions": {
                "prefix": "/prescriptions",
                "POST /prescriptions/upload": "Upload prescription image",
                "POST /prescriptions/analyze": "Analyze prescription text",
            },
            "Voice": {
                "prefix": "/voice",
                "POST /voice/transcribe": "Transcribe audio",
                "POST /voice/analyze-speech": "Transcribe and analyze",
            },
            "Analysis": {
                "prefix": "/analyze",
                "POST /analyze/report/upload": "Upload medical report",
                "POST /analyze/report/analyze/{id}": "Analyze report",
            },
        }
    }


# ============================================================================
# STARTUP MESSAGE
# ============================================================================

@app.on_event("startup")
async def startup_event():
    elapsed = time.time() - start_total
    print(f"[STARTUP] Total initialization: {elapsed:.1f}s")
    if elapsed > 30:
        print("[WARNING] Startup is slow. Check model cache paths.")

if __name__ == "__main__":
    import uvicorn
    reload_enabled = os.getenv("UVICORN_RELOAD", "false").lower() == "true"
    
    print("\n" + "="*70)
    print("Starting FastAPI server with Uvicorn...")
    print(f"Host: {config.API_HOST}")
    print(f"Port: {config.API_PORT}")
    print(f"Workers: {config.API_WORKERS}")
    print(f"Reload: {reload_enabled}")
    print("="*70 + "\n")
    
    uvicorn.run(
        "main:app",
        host=config.API_HOST,
        port=config.API_PORT,
        workers=config.API_WORKERS,
        reload=reload_enabled,
        reload_dirs=["./routers"] if reload_enabled else None,
        log_level="info",
    )
