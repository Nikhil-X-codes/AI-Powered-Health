"""
EXAMPLE IMPLEMENTATIONS
Real-world examples of how to use utilities and services together.
Copy these patterns into your router endpoints.
"""

# ============================================================================
# EXAMPLE 1: Prescription Upload & Analysis Pipeline
# ============================================================================

"""
Pipeline: Upload Image → OCR Extract → LLM Analysis → Return
File: routers/prescription.py
"""

from fastapi import APIRouter, UploadFile, File, HTTPException
import tempfile
import os
from langchain_core.messages import HumanMessage

from services import get_ocr_engine, get_groq_client, extract_text
from utils import get_prompt, cleanup_temp_file

router = APIRouter()


@router.post("/prescriptions/upload-analyze")
async def upload_and_analyze_prescription(file: UploadFile = File(...)):
    """
    Upload prescription image → Extract text → Analyze with LLM
    
    Total pipeline: 1-2 seconds
    - OCR: 500ms-1s
    - LLM: 500ms-1s
    """
    # Validate file
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    # Save temp file
    with tempfile.NamedTemporaryFile(delete=False, suffix='.jpg') as tmp:
        content = await file.read()
        tmp.write(content)
        temp_path = tmp.name
    
    try:
        # Step 1: Extract text from image
        prescription_text = extract_text(temp_path)
        
        if not prescription_text.strip():
            raise HTTPException(
                status_code=400,
                detail="Could not extract text from image"
            )
        
        # Step 2: Analyze with LLM
        client = get_groq_client()
        
        # Get prompt template and fill variables
        prompt = get_prompt(
            'prescription_analysis',
            prescription_text=prescription_text
        )
        
        # Call LLM
        response = client.invoke([HumanMessage(content=prompt)])
        
        # Return results
        return {
            "filename": file.filename,
            "extracted_text": prescription_text,
            "analysis": response.content,
            "status": "success"
        }
    
    finally:
        # Clean up temp file
        cleanup_temp_file(temp_path)


# ============================================================================
# EXAMPLE 2: Cloudinary Download → OCR → Store in Vector DB
# ============================================================================

"""
Pipeline: Download URL → Convert PDF if needed → OCR → Chunk → Embed → Store
File: routers/analyze.py
"""

from utils import (
    download_and_convert,
    chunk_medical_report,
    embed_texts,
    cleanup_temp_file
)
from services import get_collection


@router.post("/analyze/from-cloudinary")
async def analyze_from_cloudinary(cloudinary_url: str):
    """
    Download file from Cloudinary → Extract text → Chunk → Embed → Store in ChromaDB
    
    Handles:
    - JPEG, PNG, PDF images
    - Automatic PDF to image conversion
    - Smart chunking by medical sections
    - Embedding and vector storage
    """
    try:
        # Step 1: Download from URL and convert if needed
        temp_path, ext = download_and_convert(
            cloudinary_url,
            convert_pdf=True  # Auto-convert PDFs to JPEG
        )
        
        # Step 2: Extract text via OCR
        text = extract_text(temp_path)
        
        if not text.strip():
            return {"error": "Could not extract text from file"}
        
        # Step 3: Smart chunk by medical sections
        chunks = chunk_medical_report(text, section_aware=True)
        
        # Step 4: Embed all chunks
        chunk_texts = [chunk['text'] for chunk in chunks]
        embeddings = embed_texts(chunk_texts)
        
        # Step 5: Store in ChromaDB
        collection = get_collection()
        collection.add(
            documents=chunk_texts,
            embeddings=embeddings,
            metadatas=[
                {
                    "section": chunk.get('section', 'general'),
                    "chunk_num": chunk['chunk_num'],
                    "source": cloudinary_url,
                }
                for chunk in chunks
            ],
            ids=[f"chunk_{i}" for i in range(len(chunk_texts))]
        )
        
        return {
            "status": "success",
            "chunks_stored": len(chunks),
            "text_length": len(text),
            "sections": list(set(c.get('section', 'general') for c in chunks))
        }
    
    finally:
        # Always clean up
        if 'temp_path' in locals():
            cleanup_temp_file(temp_path)


# ============================================================================
# EXAMPLE 3: RAG Pipeline - Medical Question Answering
# ============================================================================

"""
Pipeline: Question → Embed → Search → LLM with Context → Answer
File: routers/chat.py
"""

from utils import embed_text, get_prompt
from services import get_groq_client, get_collection, embed_text


@router.post("/chat/rag-qa")
async def rag_question_answering(question: str):
    """
    Use stored medical knowledge base to answer questions.
    
    Process:
    1. Embed the question
    2. Search for similar chunks
    3. Get LLM to answer with context
    """
    # Step 1: Embed question
    question_embedding = embed_text(question)
    
    # Step 2: Search knowledge base
    collection = get_collection()
    search_results = collection.query(
        query_embeddings=[question_embedding],
        n_results=3  # Get top 3 similar chunks
    )
    
    # Build context from search results
    knowledge_context = "MEDICAL KNOWLEDGE BASE:\n"
    if search_results['documents'][0]:
        for i, doc in enumerate(search_results['documents'][0], 1):
            knowledge_context += f"{i}. {doc[:200]}...\n"
    else:
        knowledge_context = "No relevant knowledge found in database."
    
    # Step 3: Generate answer with LLM
    client = get_groq_client()
    
    prompt = get_prompt(
        'rag_medical_qa',
        question=question,
        knowledge_context=knowledge_context
    )
    
    response = client.invoke([HumanMessage(content=prompt)])
    
    return {
        "question": question,
        "answer": response.content,
        "sources_used": len(search_results['documents'][0]) if search_results['documents'] else 0
    }


# ============================================================================
# EXAMPLE 4: Medical Report Analysis with Chunking for Large Documents
# ============================================================================

"""
Pipeline: Upload → OCR → Chunk for token limits → Analyze each chunk → Summarize
File: routers/analyze.py
"""

from utils import (
    chunk_text,
    split_by_token_limit,
    get_prompt,
    cleanup_temp_file
)


@router.post("/analyze/large-report")
async def analyze_large_report(file: UploadFile = File(...)):
    """
    Handle large medical reports by chunking to token limits.
    
    For very long reports:
    1. Extract text
    2. Split to token limits
    3. Analyze each chunk
    4. Summarize findings
    """
    # Save temp file
    with tempfile.NamedTemporaryFile(delete=False, suffix='.jpg') as tmp:
        content = await file.read()
        tmp.write(content)
        temp_path = tmp.name
    
    try:
        # Step 1: Extract all text
        full_text = extract_text(temp_path)
        
        # Step 2: Split to stay under token limit for LLM
        chunks = split_by_token_limit(
            full_text,
            max_tokens=2000,  # Groq's limit
            model="gpt-3.5"
        )
        
        # Step 3: Analyze each chunk
        client = get_groq_client()
        analyses = []
        
        for i, chunk in enumerate(chunks):
            prompt = get_prompt(
                'medical_report_analysis',
                report_text=chunk,
                knowledge_context=""
            )
            
            response = client.invoke([HumanMessage(content=prompt)])
            analyses.append({
                "chunk": i + 1,
                "analysis": response.content
            })
        
        # Step 4: Generate overall summary
        combined_analyses = "\n\n".join(
            [f"Section {a['chunk']}: {a['analysis']}" for a in analyses]
        )
        
        summary_prompt = get_prompt(
            'medical_report_summary',
            report_text=combined_analyses
        )
        
        summary_response = client.invoke(
            [HumanMessage(content=summary_prompt)]
        )
        
        return {
            "filename": file.filename,
            "chunks_analyzed": len(chunks),
            "chunk_analyses": analyses,
            "overall_summary": summary_response.content
        }
    
    finally:
        cleanup_temp_file(temp_path)


# ============================================================================
# EXAMPLE 5: Voice Analysis Pipeline
# ============================================================================

"""
Pipeline: Upload Audio → Transcribe → Extract symptoms → Suggest care level
File: routers/voice.py
"""

from services import get_whisper_model, get_groq_client
from utils import get_prompt


@router.post("/voice/analyze-symptoms")
async def analyze_voice_symptoms(file: UploadFile = File(...)):
    """
    Patient describes symptoms via voice → Analyze and suggest care level.
    
    Process:
    1. Transcribe audio
    2. Extract symptom info
    3. Assess urgency
    """
    if not file.content_type.startswith("audio/"):
        raise HTTPException(status_code=400, detail="File must be audio")
    
    # Save temp file
    with tempfile.NamedTemporaryFile(delete=False, suffix='.wav') as tmp:
        content = await file.read()
        tmp.write(content)
        temp_path = tmp.name
    
    try:
        # Step 1: Transcribe
        model = get_whisper_model()
        segments, info = model.transcribe(temp_path, language="en")
        transcription = " ".join([seg.text for seg in segments])
        
        # Step 2: Analyze symptoms
        client = get_groq_client()
        
        prompt = get_prompt(
            'symptom_assessment',
            symptoms_description=transcription
        )
        
        analysis = client.invoke([HumanMessage(content=prompt)])
        
        return {
            "transcription": transcription,
            "analysis": analysis.content,
            "duration": info.duration
        }
    
    finally:
        cleanup_temp_file(temp_path)


# ============================================================================
# EXAMPLE 6: Multi-Service Pipeline - Full Medical Consultation
# ============================================================================

"""
Complete Example: Prescription + Report + Chat + Voice
Shows how to combine multiple services in one workflow.
"""

class MedicalConsultationPipeline:
    """Complete medical consultation workflow."""
    
    def __init__(self):
        self.groq_client = get_groq_client()
        self.collection = get_collection()
    
    async def process_prescription_image(self, image_path: str) -> dict:
        """Step 1: Prescription analysis."""
        text = extract_text(image_path)
        prompt = get_prompt('prescription_analysis', prescription_text=text)
        analysis = self.groq_client.invoke([HumanMessage(content=prompt)])
        
        return {
            "type": "prescription",
            "extracted": text,
            "analysis": analysis.content
        }
    
    async def process_medical_report(self, image_path: str) -> dict:
        """Step 2: Report analysis with RAG."""
        text = extract_text(image_path)
        chunks = chunk_medical_report(text)
        
        # Embed and search for context
        embedding = embed_text(chunks[0]['text'])
        results = self.collection.query(
            query_embeddings=[embedding],
            n_results=2
        )
        
        context = "\n".join(results['documents'][0]) if results['documents'] else ""
        
        prompt = get_prompt(
            'medical_report_analysis',
            report_text=text,
            knowledge_context=context
        )
        
        analysis = self.groq_client.invoke([HumanMessage(content=prompt)])
        
        return {
            "type": "report",
            "chunks": len(chunks),
            "analysis": analysis.content
        }
    
    async def answer_follow_up_question(self, question: str) -> dict:
        """Step 3: Answer questions with knowledge base."""
        # RAG-based answer
        embedding = embed_text(question)
        results = self.collection.query(
            query_embeddings=[embedding],
            n_results=3
        )
        
        context = "\n".join(results['documents'][0]) if results['documents'] else ""
        
        prompt = get_prompt(
            'rag_medical_qa',
            question=question,
            knowledge_context=context
        )
        
        answer = self.groq_client.invoke([HumanMessage(content=prompt)])
        
        return {
            "question": question,
            "answer": answer.content
        }


# ============================================================================
# USAGE PATTERNS
# ============================================================================

"""
Pattern 1: Context Manager for File Safety
===========================================
from utils import FileDownloadContext

with FileDownloadContext('https://example.com/file.pdf') as (path, ext):
    text = extract_text(path)
    # Auto-cleaned up
"""

"""
Pattern 2: Batch Operations
===========================
from utils import chunk_text, embed_texts

# Chunk long text
chunks = chunk_text(long_text, chunk_size=500)

# Batch embed for efficiency
embeddings = embed_texts([c['text'] for c in chunks])

# Store all at once
collection.add(documents=texts, embeddings=embeddings)
"""

"""
Pattern 3: Error Handling
==========================
from utils import cleanup_temp_file

temp_path = None
try:
    temp_path = save_temp_file(data)
    process_file(temp_path)
except Exception as e:
    logger.error(f"Error: {e}")
finally:
    if temp_path:
        cleanup_temp_file(temp_path)
"""

"""
Pattern 4: Chaining Operations
===============================
from utils import download_and_convert, chunk_text, get_prompt

# Download and convert PDF if needed
temp_path, ext = download_and_convert(url)

# Extract and chunk
text = extract_text(temp_path)
chunks = chunk_text(text)

# Use chunks for embedding or analysis
for chunk in chunks:
    embedding = embed_text(chunk)
    # Store embedding
"""

print(__doc__)
