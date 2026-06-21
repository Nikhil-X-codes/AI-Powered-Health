FROM python:3.11-slim

WORKDIR /app

# Set cache paths BEFORE pip install
ENV HF_HOME=/app/models_cache/huggingface
ENV TRANSFORMERS_CACHE=/app/models_cache/huggingface
ENV TORCH_HOME=/app/models_cache/torch
ENV WHISPER_CACHE_DIR=/app/models_cache/whisper
ENV XDG_CACHE_HOME=/app/models_cache

# System dependencies (fixed package name)
RUN apt-get update && apt-get install -y \
    libgl1 \
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

# Pre-download models during build
RUN python -c "from sentence_transformers import SentenceTransformer; SentenceTransformer('BAAI/bge-small-en')" && \
    python -c "import whisper; whisper.load_model('tiny', download_root='/app/models_cache/whisper')"

# Copy application code
COPY . .

# Google credentials mounted by Render Secret File
ENV GOOGLE_APPLICATION_CREDENTIALS=/app/google-credentials.json
ENV CHROMA_DB_PATH=/tmp/chroma_db

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:8000/health || exit 1

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "1"]