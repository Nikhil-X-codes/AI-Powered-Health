"""
Prescription Analysis Router
Endpoints for OCR + LLM analysis of medical prescriptions.
"""

import json
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from langchain_core.messages import HumanMessage

from services import get_groq_client
from utils import PRESCRIPTION_EXPLAINER_PROMPT

router = APIRouter(prefix="/prescriptions", tags=["Prescriptions"])


class MedicineData(BaseModel):
    name: str
    purpose: str
    dosage: str
    usage_instructions: str
    side_effects: str


class PrescriptionExplanationResponse(BaseModel):
    medicines: List[MedicineData]
    pharmacy_notes: Optional[str] = None


class PrescriptionExplainRequest(BaseModel):
    ocr_text: str
    prescription_id: Optional[str] = None


@router.post("/explain", response_model=PrescriptionExplanationResponse)
async def explain_prescription(request: PrescriptionExplainRequest):
    """
    Analyze OCR extracted prescription text and explain all medicines.
    
    Returns structured JSON with:
    - medicines: List of medicines with explanations
    - pharmacy_notes: Special instructions from prescription
    
    Example request:
    {
        "ocr_text": "Tab. Paracetamol 500mg BD\\nCap. Amoxicillin 250mg TDS...",
        "prescription_id": "prescription-123"
    }
    
    Example response:
    {
        "medicines": [
            {
                "name": "Paracetamol",
                "purpose": "Reduces fever and relieves mild to moderate pain",
                "dosage": "500mg, twice daily",
                "usage_instructions": "Take after meals with water",
                "side_effects": "Stomach upset, rare allergic reactions"
            }
        ],
        "pharmacy_notes": "Complete the full course"
    }
    """
    ocr_text = request.ocr_text.strip()
    if not ocr_text:
        raise HTTPException(
            status_code=400,
            detail="OCR text is required"
        )

    print(f"[Explain] OCR text ({len(ocr_text)} chars): {ocr_text[:120]}...")
    
    try:
        # Get Groq client
        client = get_groq_client()
        
        # Prepare prompt with OCR text
        prompt = PRESCRIPTION_EXPLAINER_PROMPT.format(
            ocr_text=ocr_text
        )
        
        # Call LLM for structured analysis
        response = client.invoke([HumanMessage(content=prompt)])
        response_text = response.content
        print(f"[Explain] Raw LLM response ({len(response_text)} chars): {response_text[:200]}...")
        
        # Parse JSON response
        try:
            # Clean up markdown code blocks if present
            cleaned = response_text.strip()
            if "```json" in cleaned:
                cleaned = cleaned.split("```json")[1].split("```")[0]
            elif "```" in cleaned:
                cleaned = cleaned.split("```")[1].split("```")[0]
            
            # Strip leading/trailing whitespace and any stray text
            cleaned = cleaned.strip()
            
            data = json.loads(cleaned)
        except json.JSONDecodeError as e:
            print(f"[Explain] JSON parse failed: {e}")
            print(f"[Explain] Cleaned text was: {cleaned[:300]}")
            raise HTTPException(
                status_code=500,
                detail=f"Failed to parse LLM response as JSON: {str(e)}"
            )
        
        # Validate response structure — tolerate missing key
        if "medicines" not in data:
            print("[Explain] LLM response missing 'medicines' key. Keys found:", list(data.keys()))
            data["medicines"] = []
        
        # Validate medicines
        medicines = []
        for med in data.get("medicines", []):
            try:
                m = MedicineData(
                    name=med.get("name", "Unknown"),
                    purpose=med.get("purpose", ""),
                    dosage=med.get("dosage", ""),
                    usage_instructions=med.get("usage_instructions", ""),
                    side_effects=med.get("side_effects", "")
                )
                medicines.append(m)
            except Exception as e:
                # Skip invalid medicines but log
                print(f"[Explain] Skipping invalid medicine: {e}")
                continue
        
        if not medicines:
            print("[Explain] WARNING: No medicines extracted. Returning degraded response.")
        
        return PrescriptionExplanationResponse(
            medicines=medicines,
            pharmacy_notes=data.get("pharmacy_notes", "No medicines could be identified. Please review the prescription image and try again.")
        )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Prescription analysis failed: {str(e)}"
        )
