FROM python:3.11-slim

WORKDIR /app

# Set cache paths BEFORE pip install
ENV HF_HOME=/app/models_cache/huggingface
ENV FASTEMBED_CACHE_PATH=/app/models_cache/fastembed
ENV XDG_CACHE_HOME=/app/models_cache

# System dependencies
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

# Pre-download fastembed model during build (bakes ~33MB model into image)
RUN python -c "from fastembed import TextEmbedding; TextEmbedding(model_name='BAAI/bge-small-en-v1.5')" \
    && echo "[OK] fastembed model pre-cached"

# Copy application code
COPY . .

# Google credentials mounted by Render Secret File
ENV GOOGLE_APPLICATION_CREDENTIALS=/app/google-credentials.json
ENV CHROMA_DB_PATH=/tmp/chroma_db

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:8000/health || exit 1

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "1"]