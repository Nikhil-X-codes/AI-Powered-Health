import json
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from langchain_core.messages import HumanMessage

from services import get_groq_client
from utils import MEDICAL_REPORT_METRICS_PROMPT

router = APIRouter(prefix="/analyze", tags=["Analysis"])


class ReportAnalysisRequest(BaseModel):
    ocr_text: str
    report_id: Optional[str] = None
    gender: Optional[str] = None  # For interpreting hemoglobin ranges


class MetricData(BaseModel):
    metric_name: str
    metric_value: str
    status: str  # "Normal", "High", "Low", "Borderline"
    explanation: str


class ReportAnalysisResponse(BaseModel):
    metrics: List[MetricData]
    overall_summary: str


@router.post("/report", response_model=ReportAnalysisResponse)
async def analyze_medical_report(request: ReportAnalysisRequest):
    """
    Analyze OCR extracted medical report text and extract structured health metrics.
    
    Returns structured JSON with:
    - metrics: List of extracted health metrics with status
    - overall_summary: Human-readable summary for patient
    
    Example request:
    {
        "ocr_text": "Hemoglobin: 11.2 g/dL\\nGlucose: 140 mg/dL...",
        "report_id": "report-123",
        "gender": "male"
    }
    
    Example response:
    {
        "metrics": [
            {
                "metric_name": "hemoglobin",
                "metric_value": "11.2 g/dL",
                "status": "Low",
                "explanation": "Below normal range. May indicate mild anemia."
            }
        ],
        "overall_summary": "Your blood test shows..."
    }
    """
    if not request.ocr_text.strip():
        raise HTTPException(
            status_code=400,
            detail="OCR text is required"
        )
    
    try:
        # Get Groq client
        client = get_groq_client()
        
        # Prepare prompt with OCR text
        prompt = MEDICAL_REPORT_METRICS_PROMPT.format(
            ocr_text=request.ocr_text
        )
        
        # Call LLM for structured analysis
        response = client.invoke([HumanMessage(content=prompt)])
        response_text = response.content
        
        import re
        # Parse JSON response
        try:
            cleaned = response_text.strip()
            # Clean up markdown code blocks if present
            if "```json" in cleaned:
                cleaned = cleaned.split("```json")[1].split("```")[0]
            elif "```" in cleaned:
                cleaned = cleaned.split("```")[1].split("```")[0]
            
            cleaned = cleaned.strip()
            
            # Remove trailing commas
            cleaned = re.sub(r',(\s*[}\]])', r'\1', cleaned)
            
            # Fallback to extract content between first { and last } if it has extra text
            if not cleaned.startswith("{") or not cleaned.endswith("}"):
                start_idx = cleaned.find("{")
                end_idx = cleaned.rfind("}")
                if start_idx != -1 and end_idx != -1:
                    cleaned = cleaned[start_idx:end_idx+1]

            data = json.loads(cleaned)
        except json.JSONDecodeError as e:
            print(f"[Analyze] JSON parse failed: {e}")
            print(f"[Analyze] Cleaned text was: {cleaned[:300]}...{cleaned[-300:]}")
            raise HTTPException(
                status_code=500,
                detail=f"Failed to parse LLM response as JSON: {str(e)}"
            )
        
        # Validate response structure
        if "metrics" not in data or "overall_summary" not in data:
            raise HTTPException(
                status_code=500,
                detail="Invalid response structure from LLM"
            )
        
        # Validate metrics
        metrics = []
        for metric in data.get("metrics", []):
            try:
                m = MetricData(
                    metric_name=metric.get("metric_name", ""),
                    metric_value=metric.get("metric_value", ""),
                    status=metric.get("status", ""),
                    explanation=metric.get("explanation", "")
                )
                metrics.append(m)
            except Exception:
                continue

        return ReportAnalysisResponse(
            metrics=metrics,
            overall_summary=data.get("overall_summary", "Unable to generate summary")
        )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Analysis failed: {str(e)}"
        )
