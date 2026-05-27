"""
Embeddings Router
Endpoints for semantic embeddings and vector operations.
"""

from fastapi import APIRouter
from pydantic import BaseModel
from typing import List
from services import embed_text, embed_texts

router = APIRouter(prefix="/embed", tags=["Embeddings"])


class EmbedRequest(BaseModel):
    text: str


class EmbedBatchRequest(BaseModel):
    texts: List[str]


class EmbedResponse(BaseModel):
    text: str
    embedding: List[float]
    dimension: int


@router.post("/single", response_model=EmbedResponse)
async def embed_single(request: EmbedRequest):
    """
    Embed a single text string.
    
    Request:
        {"text": "medical prescription"}
    
    Returns:
        {
            "text": "medical prescription",
            "embedding": [0.1, 0.2, ...],
            "dimension": 384
        }
    """
    embedding = embed_text(request.text)
    return EmbedResponse(
        text=request.text,
        embedding=embedding,
        dimension=len(embedding)
    )


@router.post("/batch")
async def embed_batch(request: EmbedBatchRequest):
    """
    Embed multiple texts.
    
    Request:
        {"texts": ["text1", "text2", "text3"]}
    
    Returns:
        {
            "embeddings": [
                {"text": "text1", "embedding": [...], "dimension": 384},
                ...
            ],
            "count": 3
        }
    """
    embeddings = embed_texts(request.texts)
    
    return {
        "embeddings": [
            {
                "text": text,
                "embedding": embedding,
                "dimension": len(embedding)
            }
            for text, embedding in zip(request.texts, embeddings)
        ],
        "count": len(request.texts)
    }
