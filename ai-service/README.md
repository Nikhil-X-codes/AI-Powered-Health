# AI Service Backend

FastAPI-based medical AI service with OCR, analysis, embeddings, and chat capabilities.

## Features

- **OCR (Optical Character Recognition)**: Extract text from medical images using PaddleOCR
- **Medical Report Analysis**: Analyze medical reports with Groq LLM for insights and recommendations
- **Prescription Explanation**: Explain medications in patient-friendly language
- **Text Embeddings**: Generate embeddings for medical text using Sentence Transformers
- **Vector Search**: Search similar documents in ChromaDB
- **Chat Interface**: Chat about health topics with RAG (Retrieval Augmented Generation)
- **Speech-to-Text**: Transcribe audio using Faster Whisper

## Architecture: Singleton Service Loaders

All heavy models load **once at startup** via FastAPI's lifespan events, not on every request:

| Service | Loads | Size | Startup Time |
|---------|-------|------|--------------|
| Groq LLM | ChatGroq instance | API-based | < 100ms |
| Embedder | SentenceTransformer (BAAI/bge-small-en) | ~100MB | ~2-3s |
| ChromaDB | Persistent vector DB client | ~50MB (grows) | < 500ms |
| Whisper | faster_whisper.WhisperModel("base") | ~140MB | ~2-3s |
| PaddleOCR | PaddleOCR engine | ~200MB | ~3-5s |

**Benefit**: After first startup, each request is fast (~100-500ms per API call, not 5-10s).

## Project Structure

```
ai-service/
├── main.py                    # FastAPI app with CORS + startup events
├── config.py                  # Environment variable configuration
├── .env.example               # Environment template
├── requirements.txt           # Python dependencies
├── routers/
│   ├── ocr.py                 # OCR extraction endpoints
│   ├── chat.py                # Multi-turn chat with LLM
│   ├── embed.py               # Embedding generation
│   ├── prescription.py        # Prescription analysis
│   ├── voice.py               # Speech-to-text
│   └── analyze.py             # Comprehensive analysis
├── services/
│   ├── groq_client.py         # Groq LLM singleton
│   ├── embedder.py            # SentenceTransformer singleton
│   ├── chroma_store.py        # ChromaDB vector store singleton
│   ├── ocr_engine.py          # PaddleOCR singleton
│   ├── whisper_engine.py      # Faster Whisper singleton
│   └── __init__.py            # Service exports
└── utils/
    └── text_chunker.py        # Text chunking utilities
```

## Quick Start

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

Or install individual packages:
```bash
pip install fastapi uvicorn python-dotenv
pip install langchain-groq langchain-core
pip install sentence-transformers chromadb
pip install faster_whisper paddleocr
```

### 2. Create Environment File

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

**Required variables:**
- `GROQ_API_KEY` - Get from https://console.groq.com

**Optional variables:**
- `API_PORT` - Default: 8000
- `GROQ_MODEL` - Default: mixtral-8x7b-32768
- `CORS_ORIGINS` - Default: http://localhost:3000

### 3. Run the Server

```bash
python main.py
```

Or with uvicorn directly:
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

You should see:
```
======================================================================
🚀 Starting AI Service...
======================================================================

📦 Initializing services...

✓ Groq client initialized with model: mixtral-8x7b-32768
✓ Embedder model initialized: BAAI/bge-small-en
✓ ChromaDB initialized at: ./chroma_data
✓ Whisper model initialized: base (device: cpu)
✓ PaddleOCR engine initialized (language: en)

======================================================================
✅ All services initialized successfully!
🌐 API Server: http://0.0.0.0:8000
======================================================================
```

## API Endpoints

### Health Check
```bash
GET /health                    # Quick status check
GET /health/detailed          # Detailed service status
```

### OCR (Document Text Extraction)
```bash
POST /ocr/extract                      # Extract text from image
POST /ocr/extract-detailed             # Extract with confidence scores
```

**Example:**
```bash
curl -X POST http://localhost:8000/ocr/extract \
  -F "file=@prescription.jpg"
```

### Chat (LLM Conversations)
```bash
POST /chat/completions        # Multi-turn conversation
POST /chat/quick              # Single question
```

**Example:**
```bash
curl -X POST http://localhost:8000/chat/quick \
  -H "Content-Type: application/json" \
  -d '{"question": "What are side effects of aspirin?"}'
```

### Embeddings (Semantic Search)
```bash
POST /embed/single            # Embed one text
POST /embed/batch             # Embed multiple texts
```

**Example:**
```bash
curl -X POST http://localhost:8000/embed/single \
  -H "Content-Type: application/json" \
  -d '{"text": "medical prescription"}'
```

### Prescriptions (OCR + Analysis)
```bash
POST /prescriptions/upload     # Upload prescription image
POST /prescriptions/analyze    # Analyze prescription text
POST /prescriptions/explain/{id}  # Ask questions about prescription
```

### Voice (Speech-to-Text)
```bash
POST /voice/transcribe         # Transcribe audio file
POST /voice/analyze-speech     # Transcribe + analyze symptoms
```

### Analysis (Comprehensive Pipelines)
```bash
POST /analyze/report/upload    # Upload medical report
POST /analyze/report/analyze/{id}  # Analyze with RAG
```

## API Documentation

Interactive docs available at:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Configuration

Environment variables in `.env`:

```
# Server
API_HOST=0.0.0.0
API_PORT=8000
API_WORKERS=1

# Groq LLM
GROQ_API_KEY=your_api_key
GROQ_MODEL=mixtral-8x7b-32768

# Embeddings
EMBEDDER_MODEL=BAAI/bge-small-en

# ChromaDB
CHROMA_DATA_DIR=./chroma_data
CHROMA_COLLECTION_NAME=medical_knowledge

# Whisper (Speech-to-Text)
WHISPER_MODEL=base
WHISPER_DEVICE=cpu  # Use 'cuda' for GPU

# OCR
OCR_LANGUAGE=en

# CORS
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
CORS_ALLOW_CREDENTIALS=true
```

## Service Initialization Details

### Lifespan Events (`main.py`)

The app uses FastAPI's `lifespan` context manager to load singletons at startup:

```python
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize all services
    init_groq_client()
    init_embedder()
    init_chroma()
    init_whisper()
    init_ocr()
    
    yield  # Server runs here
    
    # Shutdown: Cleanup (if needed)
```

### Service Modules

Each service follows the singleton pattern:

```python
# services/embedder.py
_embedder_model = None

def init_embedder():
    """Load model at startup (called once)"""
    global _embedder_model
    _embedder_model = SentenceTransformer(MODEL_NAME)

def get_embedder():
    """Used in route handlers"""
    return _embedder_model
```

This ensures:
- ✅ Models load once
- ✅ No delays on individual requests
- ✅ Consistent state across requests
- ✅ Easy to test and mock

## Testing Endpoints

### Test OCR
```bash
curl -X POST http://localhost:8000/ocr/extract \
  -F "file=@test_image.jpg"
```

### Test Chat
```bash
curl -X POST http://localhost:8000/chat/quick \
  -H "Content-Type: application/json" \
  -d '{"question": "What is diabetes?"}'
```

### Test Embeddings
```bash
curl -X POST http://localhost:8000/embed/single \
  -H "Content-Type: application/json" \
  -d '{"text": "patient has fever"}'
```

### Test Voice
```bash
curl -X POST http://localhost:8000/voice/transcribe \
  -F "file=@audio.mp3"
```

### Check Health
```bash
curl http://localhost:8000/health

# Response:
# {"status": "alive", "service": "Health AI Service", "version": "1.0.0"}
```

## Troubleshooting

### Models not loading?
Check the startup logs. Each service prints its status:
```
✓ Groq client initialized
✓ Embedder model initialized
✓ ChromaDB initialized
✓ Whisper model initialized
✓ PaddleOCR engine initialized
```

### API calls are slow?
- First request after startup is slow (normal for model inference)
- Subsequent requests should be fast
- If still slow, check CPU/memory usage and model device settings

### CORS errors from frontend?
Update `CORS_ORIGINS` in `.env` with your frontend URL:
```
CORS_ORIGINS=http://localhost:3000,http://localhost:3001,https://yourdomain.com
```

### Out of memory?
- Reduce model sizes in `.env` (e.g., `EMBEDDER_MODEL=sentence-transformers/all-MiniLM-L6-v2`)
- Use GPU: Set `WHISPER_DEVICE=cuda`
- Run on a machine with more RAM

## Requirements

See `requirements.txt` for all dependencies. Key packages:
- `fastapi` - Web framework
- `uvicorn` - ASGI server
- `python-dotenv` - Environment config
- `langchain-groq` - Groq LLM integration
- `sentence-transformers` - Text embeddings
- `chromadb` - Vector database
- `faster_whisper` - Speech recognition
- `paddleocr` - Document OCR

## Configuration (continued)

```bash
cp .env.example .env
```

Edit `.env` and add your:
- `GROQ_API_KEY` from [Groq Console](https://console.groq.com)
- Other optional configurations

### 3. Optional: Start ChromaDB Server

For persistent vector storage:

```bash
pip install chromadb
chroma run --path ./chroma_db
```

(Or use in-memory storage by default)

### 4. Run the Server

```bash
python main.py
```

Server will start at `http://localhost:8000`

## API Endpoints

### OCR

```bash
POST /api/v1/ocr
Content-Type: multipart/form-data

# Extract text from medical image
```

### Analysis

```bash
POST /api/v1/analyze-report
Content-Type: multipart/form-data

# Analyze medical report
```

### Prescription

```bash
POST /api/v1/explain-prescription
Content-Type: application/json

{
  "prescription_text": "..."
}
```

### Embeddings

```bash
POST /api/v1/embed
{
  "text": "Medical text here",
  "metadata": {"source": "report_1"}
}

POST /api/v1/embed/batch
{
  "texts": ["text1", "text2"],
  "metadata_list": [...]
}
```

### Chat

```bash
POST /api/v1/chat
{
  "message": "What is hypertension?",
  "context": "optional context",
  "use_rag": true
}
```

### Voice

```bash
POST /api/v1/voice/transcribe
Content-Type: multipart/form-data

# Transcribe audio

POST /api/v1/voice/synthesize
{
  "text": "Hello world",
  "voice": "en-US-AriaNeural",
  "rate": 1.0
}
```

## Configuration

Environment variables in `.env`:

- `GROQ_API_KEY`: Your Groq API key
- `GROQ_MODEL`: LLM model (default: mixtral-8x7b-32768)
- `EMBEDDER_MODEL`: Embedding model (default: all-MiniLM-L6-v2)
- `OCR_USE_GPU`: Enable GPU for OCR (default: false)
- `WHISPER_MODEL`: Whisper model size (tiny/base/small/medium)
- `TTS_VOICE`: Default voice for text-to-speech
- `CHUNK_SIZE`: Size for text chunking (default: 1024)
- `CHUNK_OVERLAP`: Overlap between chunks (default: 256)

## Development

### Health Check

```bash
curl http://localhost:8000/health
```

### API Documentation

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

### Debugging

Check logs for:
- Model initialization messages
- ChromaDB connection status
- API error responses

## Performance Notes

- First API call will load models (may take time)
- OCR with GPU requires CUDA setup
- Embeddings are cached in ChromaDB
- Use batch endpoints for multiple documents

## Dependencies

Key libraries:
- **FastAPI**: Web framework
- **Groq**: LLM API
- **ChromaDB**: Vector database
- **Sentence Transformers**: Text embeddings
- **PaddleOCR**: Document OCR
- **Faster Whisper**: Speech-to-text
- **Edge TTS**: Text-to-speech

## Troubleshooting

**ChromaDB connection fails:**
- Falls back to in-memory storage
- Ensure ChromaDB server is running (optional)

**Out of memory with models:**
- Use smaller model sizes
- Run on GPU for better memory management

**API timeouts:**
- Increase timeout for initial model loading
- Use async endpoints

## License

MIT
