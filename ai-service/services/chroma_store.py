"""
ChromaDB Vector Store Singleton
Provides persistent medical knowledge base for RAG.
"""

import os
import chromadb
from chromadb.config import Settings
from config import CHROMA_DATA_DIR, CHROMA_COLLECTION_NAME, CHROMA_DISTANCE_METRIC

_chroma_client = None
_collection = None


def init_chroma() -> chromadb.Collection:
    """Initialize and return the ChromaDB collection."""
    global _chroma_client, _collection
    
    if _collection is not None:
        return _collection
    
    # Create data directory if it doesn't exist
    os.makedirs(CHROMA_DATA_DIR, exist_ok=True)
    
    # Initialize persistent client
    _chroma_client = chromadb.PersistentClient(path=CHROMA_DATA_DIR)
    
    # Get or create medical knowledge collection
    _collection = _chroma_client.get_or_create_collection(
        name=CHROMA_COLLECTION_NAME,
        metadata={
            "hnsw:space": CHROMA_DISTANCE_METRIC,
            "description": "Medical knowledge base for RAG"
        }
    )
    
    print(f"✓ ChromaDB initialized at: {CHROMA_DATA_DIR}")
    print(f"  Collection: {CHROMA_COLLECTION_NAME} (metric: {CHROMA_DISTANCE_METRIC})")
    
    return _collection


def get_collection() -> chromadb.Collection:
    """Get the existing ChromaDB collection."""
    if _collection is None:
        raise RuntimeError("ChromaDB not initialized. Did you start the server?")
    return _collection


def add_documents(documents: list, metadatas: list = None, ids: list = None):
    """
    Add documents to the collection.
    
    Args:
        documents: List of document texts
        metadatas: List of metadata dicts (optional)
        ids: List of document IDs (optional)
    """
    collection = get_collection()
    collection.add(
        documents=documents,
        metadatas=metadatas or [{} for _ in documents],
        ids=ids or [f"doc_{i}" for i in range(len(documents))]
    )


def search(query_embeddings: list, n_results: int = 5) -> dict:
    """
    Search the collection by embedding vectors.
    
    Args:
        query_embeddings: List of query embedding vectors
        n_results: Number of results to return
        
    Returns:
        Dict with 'ids', 'distances', 'documents', 'metadatas'
    """
    collection = get_collection()
    return collection.query(
        query_embeddings=query_embeddings,
        n_results=n_results
    )


def get_all_documents() -> dict:
    """Get all documents from the collection."""
    collection = get_collection()
    return collection.get()
