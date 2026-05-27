"""
Voice/Speech Router
Endpoints for voice input and speech-to-text.
"""

from fastapi import APIRouter, UploadFile, File, HTTPException
import tempfile
import os
from services import transcribe, get_groq_client
from langchain_core.messages import HumanMessage

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
