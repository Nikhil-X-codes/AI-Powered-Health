"""
Chat Router
Endpoints for multi-turn conversations with medical context.
"""

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
    top_k: Optional[int] = 4
    temperature: Optional[float] = 0.2
    max_tokens: Optional[int] = 800


def build_where_filter(user_id: Optional[str], report_id: Optional[str]):
    filters = []

    if user_id:
        filters.append({"user_id": user_id})

    if report_id:
        filters.append({"report_id": report_id})

    if not filters:
        return None

    if len(filters) == 1:
        return filters[0]

    return {"$and": filters}


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
        where_filter = build_where_filter(request.user_id, request.report_id)

        results = search(
            query_embeddings=[query_embedding],
            n_results=request.top_k or 4,
            where=where_filter,
        )

        documents = results.get("documents", [[]])[0] or []
        metadatas = results.get("metadatas", [[]])[0] or []

        context_lines = []
        for doc, meta in zip(documents, metadatas):
            if not doc:
                continue
            source_type = meta.get("type") or meta.get("source_type") or "knowledge"
            source_id = meta.get("source_id") or meta.get("report_id") or meta.get("prescription_id")
            source_label = f"{source_type}" + (f" #{source_id}" if source_id else "")
            context_lines.append(f"- {source_label}: {doc}")

        knowledge_context = "\n".join(context_lines) if context_lines else "No relevant context found."

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
