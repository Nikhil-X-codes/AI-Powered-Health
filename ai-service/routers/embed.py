"""
Embeddings Router
Endpoints for semantic embeddings and vector operations.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from services import embed_text, embed_texts, add_documents
from utils.text_chunker import chunk_text_with_metadata

router = APIRouter(prefix="/embed", tags=["Embeddings"])


class EmbedRequest(BaseModel):
    text: str


class EmbedBatchRequest(BaseModel):
    texts: List[str]


class StoreDocument(BaseModel):
    text: str
    metadata: Optional[dict] = None
    id: Optional[str] = None


class EmbedStoreRequest(BaseModel):
    documents: List[StoreDocument]
    chunk_size: Optional[int] = 500
    overlap: Optional[int] = 50


class EmbedPipelineRequest(BaseModel):
    texts: List[str]
    source: str
    user_id: str
    report_id: Optional[str] = None
    prescription_id: Optional[str] = None
    chunk_size: Optional[int] = 500
    overlap: Optional[int] = 50


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


@router.post("/store")
async def store_documents(request: EmbedStoreRequest):
    """
    Chunk, embed, and store documents in ChromaDB.

    Request:
        {
            "documents": [
                {"text": "...", "metadata": {"user_id": "..."}, "id": "doc-1"}
            ],
            "chunk_size": 500,
            "overlap": 50
        }
    """
    try:
        if not request.documents:
            raise HTTPException(status_code=400, detail="No documents provided")

        all_texts = []
        all_metadatas = []
        all_ids = []

        for doc_index, doc in enumerate(request.documents):
            if not doc.text or not doc.text.strip():
                continue

            base_meta = doc.metadata or {}
            chunks = chunk_text_with_metadata(
                doc.text,
                chunk_size=request.chunk_size or 500,
                overlap=request.overlap or 50,
                source=base_meta.get("source")
            )

            for chunk_index, chunk in enumerate(chunks):
                chunk_id = doc.id or f"doc_{doc_index}"
                full_id = f"{chunk_id}_chunk_{chunk_index + 1}"

                chunk_meta = {
                    **base_meta,
                    "chunk_num": chunk.get("chunk_num"),
                    "total_chunks": chunk.get("total_chunks"),
                    "start_pos": chunk.get("start_pos"),
                    "end_pos": chunk.get("end_pos"),
                    "length": chunk.get("length"),
                }

                all_texts.append(chunk.get("text", ""))
                all_metadatas.append(chunk_meta)
                all_ids.append(full_id)

        if not all_texts:
            raise HTTPException(status_code=400, detail="No valid text content provided")

        embeddings = embed_texts(all_texts)
        add_documents(
            documents=all_texts,
            metadatas=all_metadatas,
            ids=all_ids,
            embeddings=embeddings,
        )

        return {
            "count": len(all_texts),
            "document_count": len(request.documents),
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("")
async def embed_pipeline(request: EmbedPipelineRequest):
    """
    Embed and store chunked text for RAG.

    Request:
        {
            "texts": ["chunk1", "chunk2"],
            "source": "report",
            "user_id": "...",
            "report_id": "..."
        }
    """
    try:
        if not request.texts:
            raise HTTPException(status_code=400, detail="texts must be a non-empty array")

        if not request.user_id:
            raise HTTPException(status_code=400, detail="user_id is required")

        if request.source not in {"report", "prescription", "medical_kb"}:
            raise HTTPException(status_code=400, detail="source must be report, prescription, or medical_kb")

        all_texts = []
        all_metadatas = []
        all_ids = []

        for text_index, text in enumerate(request.texts):
            if not text or not text.strip():
                continue

            chunks = chunk_text_with_metadata(
                text,
                chunk_size=request.chunk_size or 500,
                overlap=request.overlap or 50,
                source=request.source,
            )

            for chunk in chunks:
                chunk_num = chunk.get("chunk_num")
                # Ensure chunk IDs remain unique across multiple texts by
                # including the text index in the generated chunk id.
                chunk_id_prefix = request.report_id or request.prescription_id or f"text_{text_index}"
                chunk_id = f"{request.source}_{chunk_id_prefix}_text_{text_index}_chunk_{chunk_num}"

                metadata = {
                    "user_id": request.user_id,
                    "source": request.source,
                    "report_id": request.report_id,
                    "prescription_id": request.prescription_id,
                    "chunk_num": chunk.get("chunk_num"),
                    "total_chunks": chunk.get("total_chunks"),
                    "start_pos": chunk.get("start_pos"),
                    "end_pos": chunk.get("end_pos"),
                    "length": chunk.get("length"),
                }

                all_texts.append(chunk.get("text", ""))
                all_metadatas.append(metadata)
                all_ids.append(chunk_id)

        if not all_texts:
            raise HTTPException(status_code=400, detail="No valid text provided")

        embeddings = embed_texts(all_texts)
        add_documents(
            documents=all_texts,
            metadatas=all_metadatas,
            ids=all_ids,
            embeddings=embeddings,
        )

        return {
            "status": "embedded",
            "chunks": len(all_texts),
        }
    except HTTPException:
        # Re-raise known HTTPExceptions so FastAPI returns their status codes
        raise
    except Exception as e:
        # Surface exceptions as HTTP 500 with the error message to aid debugging
        raise HTTPException(status_code=500, detail=str(e))
