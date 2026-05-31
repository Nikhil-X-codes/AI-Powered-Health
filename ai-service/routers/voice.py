"""
Voice/Speech Router
Endpoints for voice input and speech-to-text.
"""

from fastapi import APIRouter, UploadFile, File, HTTPException, Form
import tempfile
import os
from services import transcribe, get_groq_client, embed_text, search, synthesize_speech
from langchain_core.messages import HumanMessage
from utils import RAG_MEDICAL_QA_PROMPT
from config import TTS_VOICE

router = APIRouter(prefix="/voice", tags=["Voice"])


@router.post("/transcribe")
async def transcribe_audio(file: UploadFile = File(...)):
    """
    Transcribe audio file to text.
    
    Supported formats: wav, mp3, m4a, flac, ogg
    
    Returns:
        {
            "filename": "audio.mp3",
            "text": "transcribed text",
            "duration": 12.5
        }
    """
    # Check file type
    allowed_types = ["audio/wav", "audio/mpeg", "audio/mp4", "audio/flac", "audio/ogg"]
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail=f"File type not supported. Allowed: {allowed_types}"
        )
    
    with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[1]) as tmp:
        content = await file.read()
        tmp.write(content)
        tmp_path = tmp.name
    
    try:
        text = transcribe(tmp_path)
        return {
            "filename": file.filename,
            "text": text,
            "status": "transcribed"
        }
    finally:
        os.unlink(tmp_path)


@router.post("/analyze-speech")
async def analyze_speech(audio_file: UploadFile = File(...)):
    """
    Transcribe audio and get LLM analysis (e.g., symptom description).
    """
    if not audio_file.content_type.startswith("audio/"):
        raise HTTPException(status_code=400, detail="File must be audio")
    
    with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(audio_file.filename)[1]) as tmp:
        content = await audio_file.read()
        tmp.write(content)
        tmp_path = tmp.name
    
    try:
        # Transcribe
        text = transcribe(tmp_path)
        
        # Analyze with LLM
        client = get_groq_client()
        prompt = f"""A patient described their symptoms:
"{text}"

Please analyze this symptom description and:
1. Identify potential conditions
2. Suggest next steps
3. Recommend when to seek medical care

Keep the response concise and clear."""
        
        analysis = client.invoke([HumanMessage(content=prompt)])
        
        return {
            "filename": audio_file.filename,
            "transcription": text,
            "analysis": analysis.content
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        os.unlink(tmp_path)


@router.post("")
async def voice_rag_chat(
    audio_file: UploadFile = File(...),
    user_id: str = Form(...),
    report_id: str = Form(None),
    prescription_id: str = Form(None)
):
    """
    Transcribe audio, run RAG chat, and return TTS audio.
    """
    if not audio_file.content_type.startswith("audio/"):
        raise HTTPException(status_code=400, detail="File must be audio")

    with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(audio_file.filename)[1]) as tmp:
        content = await audio_file.read()
        tmp.write(content)
        tmp_path = tmp.name

    try:
        transcription = transcribe(tmp_path)

        query_embedding = embed_text(transcription)
        where_filter = {"user_id": user_id}
        if report_id:
            where_filter = {"$and": [{"user_id": user_id}, {"report_id": report_id}]}
        if prescription_id:
            where_filter = {"$and": [{"user_id": user_id}, {"prescription_id": prescription_id}]}

        results = search(
            query_embeddings=[query_embedding],
            n_results=4,
            where=where_filter,
        )

        documents = results.get("documents", [[]])[0] or []
        metadatas = results.get("metadatas", [[]])[0] or []

        context_lines = []
        for doc, meta in zip(documents, metadatas):
            if not doc:
                continue
            source_type = meta.get("source") or meta.get("source_type") or "knowledge"
            source_id = meta.get("report_id") or meta.get("prescription_id") or meta.get("source_id")
            source_label = f"{source_type}" + (f" #{source_id}" if source_id else "")
            context_lines.append(f"- {source_label}: {doc}")

        knowledge_context = "\n".join(context_lines) if context_lines else "No relevant context found."

        prompt = RAG_MEDICAL_QA_PROMPT.format(
            knowledge_context=knowledge_context,
            question=transcription,
        )

        client = get_groq_client()
        response = client.invoke([HumanMessage(content=prompt)])

        audio_bytes = await synthesize_speech(response.content, TTS_VOICE)

        return {
            "transcription": transcription,
            "answer": response.content,
            "audio": audio_bytes.decode("latin1"),
            "audio_mime": "audio/mpeg",
            "model": client.model_name,
            "sources": [
                {
                    "text": doc,
                    "metadata": meta,
                }
                for doc, meta in zip(documents, metadatas)
            ],
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        os.unlink(tmp_path)
