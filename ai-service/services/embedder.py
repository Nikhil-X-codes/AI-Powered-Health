"""
Sentence Embedder Singleton
Loads the transformer model once at startup.
Used for RAG embeddings and semantic search.
"""

from config import EMBEDDER_MODEL

_embedder_model = None


def init_embedder():
    """Initialize and return the embedder model."""
    global _embedder_model
    from sentence_transformers import SentenceTransformer
    if _embedder_model is None:
        _embedder_model = SentenceTransformer(EMBEDDER_MODEL)
        print(f"[OK] Embedder model initialized: {EMBEDDER_MODEL}")
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
    return embedder.encode(text, convert_to_tensor=False).tolist()


def embed_texts(texts: list) -> list:
    """
    Embed multiple texts.
    
    Args:
        texts: List of text strings
        
    Returns:
        List of embedding vectors
    """
    embedder = get_embedder()
    return embedder.encode(texts, convert_to_tensor=False).tolist()
