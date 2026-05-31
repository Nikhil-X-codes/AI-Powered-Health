"""
Chat Router
Endpoints for multi-turn conversations with medical context.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from services import get_groq_client, get_collection, embed_text, search
from utils import RAG_MEDICAL_QA_PROMPT

router = APIRouter(prefix="/chat", tags=["Chat"])
debug_router = APIRouter(tags=["Debug"])


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

    if report_id:
        filters.append({"report_id": report_id})

    if prescription_id:
        filters.append({"prescription_id": prescription_id})

    if not filters:
        return None

    if len(filters) == 1:
        return filters[0]

    return {"$and": filters}


def build_context_lines(documents: List[str], metadatas: List[dict]) -> List[str]:
    context_lines = []

    for doc, meta in zip(documents, metadatas):
        if not doc:
            continue

        source_type = meta.get("source") or meta.get("type") or meta.get("source_type") or "document"
        source_id = meta.get("report_id") or meta.get("prescription_id") or meta.get("source_id")
        chunk_num = meta.get("chunk_num") or meta.get("chunk_index")

        label = source_type
        if source_id:
            label += f" #{source_id}"
        if chunk_num is not None:
            label += f" chunk {chunk_num}"

        context_lines.append(f"[{label}] {doc}")

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

        if not context_lines:
            client = get_groq_client()
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

        prompt = RAG_MEDICAL_QA_PROMPT.format(
            knowledge_context=knowledge_context,
            question=request.question,
        )

        client = get_groq_client()
        from langchain_core.messages import HumanMessage

        response = client.invoke(
            [HumanMessage(content=prompt)],
            temperature=request.temperature,
            max_tokens=request.max_tokens,
        )

        return {
            "question": request.question,
            "answer": response.content,
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


@router.post("")
async def rag_chat(request: RAGRequest):
    """
    Primary RAG chat endpoint (alias for /chat/rag).
    """
    return await rag_question_answering(request)


@debug_router.get("/debug/retrieval")
async def debug_retrieval(user_id: str, report_id: Optional[str] = None, query: str = ""):
    """
    Inspect Chroma retrieval for a given user/report and query.
    """
    if not query.strip():
        raise HTTPException(status_code=400, detail="query is required")

    try:
        collection = get_collection()
        user_docs = collection.get(
            where={"user_id": user_id},
            limit=10,
            include=["documents", "metadatas"],
        )

        query_embedding = embed_text(query)
        where_filter = build_where_filter(user_id, report_id)
        results = search(
            query_embeddings=[query_embedding],
            n_results=4,
            where=where_filter,
        )

        return {
            "total_user_docs": len(user_docs.get("ids", [])),
            "retrieved_chunks": results.get("documents", [[]])[0] or [],
            "retrieved_distances": results.get("distances", [[]])[0] or [],
            "retrieved_metadatas": results.get("metadatas", [[]])[0] or [],
            "where_filter": where_filter,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
