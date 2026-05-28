"""
Groq LLM Client Singleton
Loads once at startup to avoid re-authentication on every request.
"""

from langchain_groq import ChatGroq
from config import GROQ_API_KEY, GROQ_MODEL

_groq_client: ChatGroq = None


def init_groq_client() -> ChatGroq:
    """Initialize and return the Groq client."""
    global _groq_client
    if _groq_client is None:
        _groq_client = ChatGroq(
            api_key=GROQ_API_KEY,
            model_name=GROQ_MODEL,
            temperature=0.7,
        )
        print(f"[OK] Groq client initialized with model: {GROQ_MODEL}")
    return _groq_client


def get_groq_client() -> ChatGroq:
    """Get the existing Groq client."""
    if _groq_client is None:
        raise RuntimeError("Groq client not initialized. Did you start the server?")
    return _groq_client
