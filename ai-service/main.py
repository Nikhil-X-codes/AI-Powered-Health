"""
FastAPI Application Entry Point
Initializes the AI service with CORS, service loaders, and router mounting.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import sys
import traceback

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
    Manage app lifecycle: startup (load singletons) and shutdown.
    This ensures heavy models load once when the server starts.
    """
    
    print("\n" + "="*70)
    print(">> Starting AI Service...")
    print("="*70)
    
    # Load all singletons at startup
    try:
        print("\n[INIT] Initializing services...\n")
        
        # Initialize each service
        try:
            init_groq_client()
        except Exception as e:
            print(f"[WARN] Groq client initialization failed: {e}")
            traceback.print_exc()
        
        try:
            init_embedder()
        except Exception as e:
            print(f"[WARN] Embedder initialization failed: {e}")
            traceback.print_exc()
        
        try:
            init_chroma()
        except Exception as e:
            print(f"[WARN] ChromaDB initialization failed: {e}")
            traceback.print_exc()
        
        try:
            init_whisper()
        except Exception as e:
            print(f"[WARN] Whisper initialization failed: {e}")
            traceback.print_exc()
        
        try:
            init_ocr()
        except Exception as e:
            print(f"[WARN] OCR initialization failed: {e}")
            traceback.print_exc()
        
        print("\n" + "="*70)
        print("[OK] All services initialized successfully!")
        print(f"[SERVER] API Server: http://{config.API_HOST}:{config.API_PORT}")
        print("="*70 + "\n")
        
    except Exception as e:
        print(f"\n[ERROR] Failed to initialize services: {e}")
        traceback.print_exc()
        sys.exit(1)
    
    yield  # Server runs here
    
    # Shutdown cleanup (if needed)
    print("\n[SHUTDOWN] Shutting down AI Service...")
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

@app.get("/health", tags=["Health"])
async def health_check():
    """
    Health check endpoint.
    Used by load balancers and monitoring to verify service is alive.
    """
    return {
        "status": "alive",
        "service": "Health AI Service",
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

print("[MOUNT] Mounting routers...")

app.include_router(ocr.router)
app.include_router(chat.router)
app.include_router(chat.debug_router)
app.include_router(embed.router)
app.include_router(prescription.router)
app.include_router(voice.router)
app.include_router(analyze.router)

print("   [OK] /ocr")
print("   [OK] /chat")
print("   [OK] /debug")
print("   [OK] /embed")
print("   [OK] /prescriptions")
print("   [OK] /voice")
print("   [OK] /analyze")


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

if __name__ == "__main__":
    import uvicorn
    
    print("\n" + "="*70)
    print("Starting FastAPI server with Uvicorn...")
    print(f"Host: {config.API_HOST}")
    print(f"Port: {config.API_PORT}")
    print(f"Workers: {config.API_WORKERS}")
    print("="*70 + "\n")
    
    uvicorn.run(
        "main:app",
        host=config.API_HOST,
        port=config.API_PORT,
        workers=config.API_WORKERS,
        reload=True,  # Auto-reload on code changes
        log_level="info",
    )
