"""
Sentence Embedder
Uses HuggingFace Inference API in production (zero RAM overhead).
Falls back to local SentenceTransformer model in development.
"""

import os
import requests
from config import EMBEDDER_MODEL

ENVIRONMENT = os.getenv("ENVIRONMENT", "development")

_embedder_model = None


def _use_remote():
    """Check if we should use the remote HF Inference API."""
    return ENVIRONMENT == "production" or os.environ.get("USE_REMOTE_EMBEDDING", "").lower() == "true"


def init_embedder():
    """Initialize and return the local embedder model (development only)."""
    global _embedder_model
    if _use_remote():
        print(f"[OK] Embedder using remote HF Inference API for model: {EMBEDDER_MODEL}")
        return None
    from sentence_transformers import SentenceTransformer
    if _embedder_model is None:
        _embedder_model = SentenceTransformer(EMBEDDER_MODEL)
        print(f"[OK] Embedder model initialized locally: {EMBEDDER_MODEL}")
    return _embedder_model


def get_embedder():
    """Get the existing embedder model, initializing it if necessary."""
    global _embedder_model
    if _use_remote():
        return None
    if _embedder_model is None:
        init_embedder()
    return _embedder_model


def _embed_text_remote(text: str) -> list:
    """Generate embedding using Hugging Face Inference API."""
    token = os.environ.get("HF_TOKEN") or os.environ.get("HF_API_KEY")
    headers = {}
    if token:
        headers["Authorization"] = f"Bearer {token}"

    api_url = f"https://api-inference.huggingface.co/pipeline/feature-extraction/{EMBEDDER_MODEL}"
    response = requests.post(api_url, json={"inputs": text}, headers=headers, timeout=30)
    response.raise_for_status()
    data = response.json()

    # Process HF response format (can be 1D, 2D, or 3D)
    if isinstance(data, list):
        if len(data) > 0 and isinstance(data[0], list):
            if len(data[0]) > 0 and isinstance(data[0][0], list):
                # Token-level embeddings (3D), mean pool them
                embeddings = data[0]
                dim = len(embeddings[0])
                mean_emb = [0.0] * dim
                for emb in embeddings:
                    for i in range(dim):
                        mean_emb[i] += emb[i]
                for i in range(dim):
                    mean_emb[i] /= len(embeddings)
                return mean_emb
            else:
                # 2D list (single sentence embedding nested in list)
                return data[0]
        else:
            return data
    raise ValueError(f"Unexpected response format from HF Inference API: {type(data)}")


def _embed_texts_remote(texts: list) -> list:
    """Generate embeddings for multiple texts using Hugging Face Inference API."""
    token = os.environ.get("HF_TOKEN") or os.environ.get("HF_API_KEY")
    headers = {}
    if token:
        headers["Authorization"] = f"Bearer {token}"

    api_url = f"https://api-inference.huggingface.co/pipeline/feature-extraction/{EMBEDDER_MODEL}"
    response = requests.post(api_url, json={"inputs": texts}, headers=headers, timeout=30)
    response.raise_for_status()
    data = response.json()

    if isinstance(data, list):
        results = []
        for item in data:
            if isinstance(item, list) and len(item) > 0 and isinstance(item[0], list):
                dim = len(item[0])
                mean_emb = [0.0] * dim
                for emb in item:
                    for i in range(dim):
                        mean_emb[i] += emb[i]
                for i in range(dim):
                    mean_emb[i] /= len(item)
                results.append(mean_emb)
            else:
                results.append(item)
        return results
    raise ValueError(f"Unexpected response format from HF Inference API: {type(data)}")


def embed_text(text: str) -> list:
    """
    Embed a single text string.

    Args:
        text: The text to embed

    Returns:
        List of floats representing the embedding
    """
    if _use_remote():
        return _embed_text_remote(text)

    embedder = get_embedder()
    return embedder.encode(text, convert_to_tensor=False).tolist()


def embed_texts(texts: list) -> list:
    """
    Embed multiple texts.

    Args:
        texts: List of text strings

    Returns:
        List of embedding vectors
    """
    if _use_remote():
        return _embed_texts_remote(texts)

    embedder = get_embedder()
    return embedder.encode(texts, convert_to_tensor=False).tolist()
