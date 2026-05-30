"""
Chat Router
Endpoints for multi-turn conversations with medical context.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from services import get_groq_client, embed_text, search

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

        has_personal_context = len(context_lines) > 0
        knowledge_context = "\n".join(context_lines) if has_personal_context else ""

        if has_personal_context:
            prompt = f"""You are a medical assistant.

Use the PERSONAL RECORD CONTEXT below as primary evidence. If the context is incomplete for the user question, you may supplement with general medical knowledge.

Rules:
- Clearly prioritize personal record context.
- If you add general medical knowledge, explicitly say it is general and may not reflect the user's exact case.
- Keep response practical and concise.
- Do not invent personal record facts that are not in the context.

PERSONAL RECORD CONTEXT:
{knowledge_context}

USER QUESTION:
{request.question}

Return a clear answer with short bullet points when useful.
"""
        else:
            prompt = f"""You are a medical assistant.

No personal record context is available for this query.
Answer using general medical knowledge only.

Rules:
- Start your answer with: "General medical information (not from your personal records):"
- Keep answer clear, accurate, and concise.
- Include common side effects, common serious side effects, and when to seek care if relevant.
- Avoid definitive diagnosis.

USER QUESTION:
{request.question}
"""

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
