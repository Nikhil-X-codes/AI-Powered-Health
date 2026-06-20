FROM python:3.11-slim

WORKDIR /app

# System dependencies (including curl for health check)
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libgomp1 \
    ffmpeg \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Pre-download models into image
RUN python -c "import os; os.environ['HF_HOME']='/app/models_cache/huggingface'; from sentence_transformers import SentenceTransformer; SentenceTransformer('BAAI/bge-small-en')" && \
    python -c "import whisper; whisper.load_model('tiny', download_root='/app/models_cache/whisper')"

# Copy application (contains credentials if building locally)
COPY . .

ENV GOOGLE_APPLICATION_CREDENTIALS=/app/google-credentials.json
ENV HF_HOME=/app/models_cache/huggingface
ENV WHISPER_CACHE_DIR=/app/models_cache/whisper
ENV CHROMA_DB_PATH=/app/chroma_db

EXPOSE 8000

# Health check endpoint must exist in your FastAPI app
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:8000/health || exit 1

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "1"]

