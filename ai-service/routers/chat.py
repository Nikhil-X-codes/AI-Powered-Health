"""
Chat Router
Endpoints for multi-turn conversations with medical context.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from services import get_groq_client

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
