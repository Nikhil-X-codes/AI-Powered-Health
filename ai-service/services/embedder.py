"""
Sentence Embedder Singleton
Uses fastembed (ONNX Runtime) for lightweight, fast embeddings.
~90MB RAM vs ~400MB for PyTorch-based sentence-transformers.
"""

import os
from config import EMBEDDER_MODEL

# Map the model name to fastembed's supported format
_FASTEMBED_MODEL_MAP = {
    "BAAI/bge-small-en": "BAAI/bge-small-en-v1.5",
    "BAAI/bge-small-en-v1.5": "BAAI/bge-small-en-v1.5",
    "BAAI/bge-base-en": "BAAI/bge-base-en-v1.5",
    "BAAI/bge-base-en-v1.5": "BAAI/bge-base-en-v1.5",
}

_embedder_model = None


def _get_fastembed_model_name() -> str:
    """Get the fastembed-compatible model name."""
    return _FASTEMBED_MODEL_MAP.get(EMBEDDER_MODEL, EMBEDDER_MODEL)


def init_embedder():
    """Initialize and return the fastembed model."""
    global _embedder_model
    if _embedder_model is None:
        from fastembed import TextEmbedding
        model_name = _get_fastembed_model_name()
        _embedder_model = TextEmbedding(model_name=model_name)
        print(f"[OK] Embedder initialized with fastembed: {model_name}")
    return _embedder_model


def get_embedder():
    """Get the existing embedder model, initializing it if necessary."""
    global _embedder_model
    if _embedder_model is None:
        init_embedder()
    return _embedder_model


def embed_text(text: str) -> list:
    """
    Embed a single text string.

    Args:
        text: The text to embed

    Returns:
        List of floats representing the embedding
    """
    embedder = get_embedder()
    # fastembed returns a generator, convert to list
    embeddings = list(embedder.embed([text]))
    return embeddings[0].tolist()


def embed_texts(texts: list) -> list:
    """
    Embed multiple texts.

    Args:
        texts: List of text strings

    Returns:
        List of embedding vectors
    """
    embedder = get_embedder()
    embeddings = list(embedder.embed(texts))
    return [emb.tolist() for emb in embeddings]
