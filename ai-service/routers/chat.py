"""
Chat Router
Endpoints for multi-turn conversations with medical context.
"""

import re

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from services import get_groq_client, embed_text, search
from utils import RAG_MEDICAL_QA_PROMPT

router = APIRouter(prefix="/chat", tags=["Chat"])


class Message(BaseModel):
    role: str  # "user" or "assistant"
    content: str


class ChatRequest(BaseModel):
    messages: List[Message]
    temperature: Optional[float] = 0.7
    max_tokens: Optional[int] = 2000


class ChatResponse(BaseModel):
    response: str
    model: str


class RAGRequest(BaseModel):
    question: str
    user_id: Optional[str] = None
    report_id: Optional[str] = None
    prescription_id: Optional[str] = None
    top_k: Optional[int] = 4
    temperature: Optional[float] = 0.2
    max_tokens: Optional[int] = 800


def build_where_filter(user_id: Optional[str], report_id: Optional[str], prescription_id: Optional[str]):
    filters = []

    if user_id:
        filters.append({"user_id": user_id})

    doc_id = report_id or prescription_id
    if report_id and prescription_id and report_id != prescription_id:
        filters.append({"report_id": report_id})
        filters.append({"prescription_id": prescription_id})
    elif doc_id:
        filters.append({
            "$or": [
                {"report_id": doc_id},
                {"prescription_id": doc_id},
            ]
        })

    if not filters:
        return None

    if len(filters) == 1:
        return filters[0]

    return {"$and": filters}


def is_usable_rag_context(context_lines: List[str]) -> bool:
    if not context_lines:
        return False

    combined = "\n".join(context_lines).strip()
    if len(combined) < 40:
        return False

    normalized = combined.lower().strip()
    if normalized == "test text" or (normalized.startswith("test text") and len(combined) < 80):
        return False

    return True


def sanitize_rag_answer(text: str) -> str:
    """Remove internal citation blocks the model sometimes adds despite instructions."""
    if not text:
        return text

    cleaned = text.strip()
    for marker in (
        "I used the following record details",
        "I used the following records",
        "Based on the following record",
    ):
        idx = cleaned.lower().find(marker.lower())
        if idx != -1:
            cleaned = cleaned[:idx].strip()
            break

    lines = []
    for line in cleaned.split("\n"):
        stripped = line.strip()
        if re.search(r"#[0-9a-f-]{36}", stripped, re.I) and re.search(r"chunk\s*\d+", stripped, re.I):
            continue
        if re.match(r"^[-•]\s*Prescription:\s*#", stripped, re.I):
            continue
        lines.append(line)

    return "\n".join(lines).strip()


def build_context_lines(documents: List[str], metadatas: List[dict]) -> List[str]:
    context_lines = []

    for doc, meta in zip(documents, metadatas):
        if not doc:
            continue

        source_type = meta.get("source") or meta.get("type") or meta.get("source_type") or "document"
        if source_type == "prescription":
            label = "Prescription excerpt"
        elif source_type == "report":
            label = "Medical report excerpt"
        else:
            label = "Record excerpt"

        context_lines.append(f"{label}:\n{doc}")

    return context_lines


@router.post("/completions", response_model=ChatResponse)
async def chat_completion(request: ChatRequest):
    """
    Send a multi-turn conversation to Groq LLM.
    
    Request:
        {
            "messages": [
                {"role": "user", "content": "What are side effects of aspirin?"},
                {"role": "assistant", "content": "..."}
            ],
            "temperature": 0.7
        }
    
    Returns:
        {"response": "...", "model": "mixtral-8x7b-32768"}
    """
    try:
        client = get_groq_client()
        
        # Convert to LangChain message format
        from langchain_core.messages import HumanMessage, AIMessage
        langchain_messages = []
        for msg in request.messages:
            if msg.role == "user":
                langchain_messages.append(HumanMessage(content=msg.content))
            elif msg.role == "assistant":
                langchain_messages.append(AIMessage(content=msg.content))
        
        # Call LLM
        response = client.invoke(
            langchain_messages,
            temperature=request.temperature,
            max_tokens=request.max_tokens
        )
        
        return ChatResponse(
            response=response.content,
            model=client.model_name
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/quick")
async def quick_question(question: str):
    """
    Quick single-turn question to Groq.
    """
    try:
        client = get_groq_client()
        from langchain_core.messages import HumanMessage
        
        response = client.invoke([HumanMessage(content=question)])
        
        return {
            "question": question,
            "answer": response.content,
            "model": client.model_name
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/rag")
async def rag_question_answering(request: RAGRequest):
    """
    RAG-based medical Q&A over ChromaDB knowledge base.
    """
    if not request.question or not request.question.strip():
        raise HTTPException(status_code=400, detail="Question is required")

    try:
        query_embedding = embed_text(request.question)
        where_filter = build_where_filter(request.user_id, request.report_id, request.prescription_id)

        results = search(
            query_embeddings=[query_embedding],
            n_results=request.top_k or 4,
            where=where_filter,
        )

        documents = results.get("documents", [[]])[0] or []
        metadatas = results.get("metadatas", [[]])[0] or []
        distances = results.get("distances", [[]])[0] or []

        context_lines = build_context_lines(documents, metadatas)
        knowledge_context = "\n\n".join(context_lines)

        client = get_groq_client()

        if not context_lines:
            return {
                "question": request.question,
                "answer": "I don't see information about that in your uploaded records. Please upload the relevant prescription or report.",
                "sources": [],
                "retrieval": {
                    "matched_chunks": 0,
                    "distances": distances,
                    "where_filter": where_filter,
                },
                "model": client.model_name,
            }

        if not is_usable_rag_context(context_lines):
            return {
                "question": request.question,
                "answer": (
                    "This document is not indexed with real prescription text yet "
                    "(only placeholder data was found in search). "
                    "Open Dashboard → Prescriptions → select this prescription → click **Explain** "
                    "to scan the image and rebuild the chat index."
                ),
                "sources": [
                    {"text": doc, "metadata": meta}
                    for doc, meta in zip(documents, metadatas)
                ],
                "retrieval": {
                    "matched_chunks": len(context_lines),
                    "distances": distances,
                    "where_filter": where_filter,
                    "index_status": "placeholder",
                },
                "model": client.model_name,
            }

        prompt = RAG_MEDICAL_QA_PROMPT.format(
            knowledge_context=knowledge_context,
            question=request.question,
        )

        from langchain_core.messages import HumanMessage

        response = client.invoke(
            [HumanMessage(content=prompt)],
            temperature=request.temperature,
            max_tokens=request.max_tokens,
        )

        return {
            "question": request.question,
            "answer": sanitize_rag_answer(response.content),
            "sources": [
                {
                    "text": doc,
                    "metadata": meta,
                }
                for doc, meta in zip(documents, metadatas)
            ],
            "retrieval": {
                "matched_chunks": len(context_lines),
                "distances": distances,
                "where_filter": where_filter,
            },
            "model": client.model_name,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
