"""
LLM Prompt Templates
Predefined prompts for medical AI tasks.
"""

# ============================================================================
# OCR & PRESCRIPTION PROMPTS
# ============================================================================

PRESCRIPTION_ANALYSIS_PROMPT = """Analyze this prescription and provide:

1. **Medications Identified**: List each medication, dosage, and frequency
2. **Potential Drug Interactions**: Any concerning combinations
3. **Common Side Effects**: For each medication
4. **Warnings & Precautions**: Important things patient should know
5. **Contraindications**: Any red flags based on typical medical history

Prescription:
{prescription_text}

Provide a structured, patient-friendly analysis."""


PRESCRIPTION_EXPLANATION_PROMPT = """Context: This is a prescription for patient education.

Prescription:
{prescription_text}

Question from patient:
{question}

Answer in simple, non-medical language. If the question is about something not in the prescription, say so."""


# ============================================================================
# MEDICAL REPORT ANALYSIS PROMPTS
# ============================================================================

MEDICAL_REPORT_ANALYSIS_PROMPT = """You are a medical AI assistant. Analyze this medical report and provide:

1. **Key Findings**: Main clinical observations
2. **Abnormalities**: Any values or findings outside normal range
3. **Potential Conditions**: Based on findings
4. **Recommended Follow-up**: Tests or specialist consultations
5. **Patient-Friendly Summary**: Explanation for patient

Medical Report:
{report_text}

{knowledge_context}

Provide structured analysis."""


MEDICAL_REPORT_SUMMARY_PROMPT = """Summarize this medical report in 3-5 sentences for patient understanding:

{report_text}

Use simple language, avoid jargon."""


# ============================================================================
# RAG (RETRIEVAL AUGMENTED GENERATION) PROMPTS
# ============================================================================

RAG_MEDICAL_QA_PROMPT = """You are a medical knowledge assistant. Answer the user's question based on the provided medical knowledge base.

Knowledge Base References:
{knowledge_context}

User Question:
{question}

Instructions:
- Use only the provided context as your source of truth
- If the context does not contain the answer, say exactly: "I don't see information about that in your uploaded records. Please upload the relevant prescription or report."
- Do not rely on general medical knowledge unless the context explicitly supports it
- If the context is relevant, answer in a concise patient-friendly way and cite the record details you used

Answer:"""


RAG_SYMPTOM_ANALYSIS_PROMPT = """Analyze the patient's symptoms using medical knowledge base.

Patient Symptoms:
{symptoms_text}

Medical Knowledge Base:
{knowledge_context}

Provide:
1. Potential Conditions
2. When to Seek Care
3. Home Care Recommendations
4. Follow-up Steps"""


# ============================================================================
# MEDICATION PROMPTS
# ============================================================================

MEDICATION_INTERACTION_PROMPT = """Check for drug interactions between these medications:

Medications:
{medication_list}

Provide:
1. Any serious interactions
2. Moderate interactions
3. Minor interactions
4. Recommendations for patient"""


MEDICATION_SIDE_EFFECTS_PROMPT = """List common side effects for these medications:

Medications:
{medication_text}

Format:
- Medication name
  - Common side effects
  - Serious side effects
  - When to contact doctor"""


# ============================================================================
# SYMPTOM & DIAGNOSIS PROMPTS
# ============================================================================

SYMPTOM_ASSESSMENT_PROMPT = """Patient reports the following symptoms:

{symptoms_description}

Provide:
1. Possible Causes (most to least likely)
2. Red Flags (seek immediate care if...)
3. Self-Care Options
4. When to see a doctor
5. Recommended tests/specialist

Note: This is educational only. Always recommend seeing a healthcare provider."""


DIFFERENTIAL_DIAGNOSIS_PROMPT = """Based on the following presentation, list differential diagnoses:

Chief Complaint: {chief_complaint}

History:
{patient_history}

Physical Exam:
{exam_findings}

Labs/Imaging:
{test_results}

Provide:
1. Most likely diagnosis
2. Other diagnoses to consider
3. Recommended next steps"""


# ============================================================================
# HEALTH EDUCATION PROMPTS
# ============================================================================

PATIENT_EDUCATION_PROMPT = """Create patient education material about {topic}:

Include:
1. What is it?
2. Symptoms to watch for
3. When to see a doctor
4. Prevention strategies
5. Lifestyle modifications
6. Common myths vs facts

Use simple, clear language."""


MEDICATION_EDUCATION_PROMPT = """Create patient education about the medication {medication_name}:

Include:
1. What it does
2. How to take it
3. Side effects (common and serious)
4. What to avoid (food, drinks, other meds)
5. How long it takes to work
6. When to contact doctor"""


# ============================================================================
# CLINICAL DECISION SUPPORT PROMPTS
# ============================================================================

CLINICAL_SUMMARY_PROMPT = """Create a clinical summary from this patient data:

Patient Info: {patient_info}
Chief Complaint: {chief_complaint}
History: {history}
Physical Exam: {exam}
Labs: {labs}
Current Medications: {medications}

Provide:
1. Problem List
2. Current Assessment
3. Treatment Plan
4. Monitoring Plan
5. Follow-up Schedule"""


RISK_STRATIFICATION_PROMPT = """Assess clinical risk for {condition}:

Patient Factors:
{patient_factors}

Risk Factors Present:
{risk_factors}

Protective Factors:
{protective_factors}

Provide:
1. Risk Level (Low/Moderate/High)
2. Risk Score/Justification
3. Recommended Actions
4. Monitoring Recommendations"""


# ============================================================================
# DOCUMENT EXTRACTION PROMPTS
# ============================================================================

OCR_CORRECTION_PROMPT = """The following text was extracted from an image via OCR.
Please correct any obvious errors while preserving the meaning:

{ocr_text}

Return the corrected text with minimal changes."""


STRUCTURED_DATA_EXTRACTION_PROMPT = """Extract structured medical data from this text:

{document_text}

Extract:
1. Patient Information (name, DOB, MRN)
2. Chief Complaint
3. Diagnosis
4. Medications
5. Allergies
6. Vital Signs
7. Test Results

Format as JSON."""


# ============================================================================
# MEDICAL REPORT ANALYSIS PROMPTS (NEW)
# ============================================================================

MEDICAL_REPORT_METRICS_PROMPT = """You are a medical report analyzer. Extract all measurable health metrics from the following OCR text and return STRICT JSON.

For each metric, provide:
- metric_name: the test name (e.g., "hemoglobin", "glucose_fasting")
- metric_value: the numeric value with unit (e.g., "11.2 g/dL")
- status: one of ["Normal", "High", "Low", "Borderline"]
- explanation: a simple 1-sentence explanation for a non-medical person

Reference ranges to use:
- Hemoglobin: 13.5-17.5 g/dL (male), 12.0-15.5 g/dL (female)
- Glucose (Fasting): 70-100 mg/dL
- Total Cholesterol: <200 mg/dL
- LDL Cholesterol: <100 mg/dL
- HDL Cholesterol: >40 mg/dL (male), >50 mg/dL (female)
- Triglycerides: <150 mg/dL
- Blood Pressure Systolic: <120 mmHg
- Blood Pressure Diastolic: <80 mmHg

OCR Text:
{ocr_text}

Return ONLY valid JSON. No markdown, no explanation outside JSON.
Format:
{{
  "metrics": [
    {{
      "metric_name": "hemoglobin",
      "metric_value": "11.2 g/dL",
      "status": "Low",
      "explanation": "Below normal range. May indicate mild anemia."
    }}
  ],
  "overall_summary": "Brief 2-sentence summary of the report for a patient"
}}"""


# ============================================================================
# PRESCRIPTION ANALYSIS PROMPTS (NEW)
# ============================================================================

PRESCRIPTION_EXPLAINER_PROMPT = """You are a prescription explainer for patients. Analyze the following OCR text from a doctor's prescription and extract all medicines with clear, simple explanations.

For EACH medicine detected, provide:
- name: generic or brand name (e.g., "Paracetamol", "Amoxicillin")
- purpose: what condition it treats (1 sentence, simple language, no medical jargon)
- dosage: exact amount and frequency (e.g., "500mg, twice daily")
- usage_instructions: when/how to take (e.g., "Take after meals with water", "Take at bedtime")
- side_effects: list 2-3 most common side effects patients should know about

OCR Text from Prescription:
{ocr_text}

Return ONLY valid JSON. No markdown, no explanation outside JSON.
Format:
{{
  "medicines": [
    {{
      "name": "Paracetamol",
      "purpose": "Reduces fever and relieves mild to moderate pain",
      "dosage": "500mg, twice daily",
      "usage_instructions": "Take after meals with water",
      "side_effects": "Stomach upset, rare allergic reactions"
    }},
    {{
      "name": "Amoxicillin",
      "purpose": "Treats bacterial infections like throat and ear infections",
      "dosage": "250mg, three times daily",
      "usage_instructions": "Take with or without food, complete the full course",
      "side_effects": "Nausea, diarrhea, rash (tell doctor if allergic to penicillin)"
    }}
  ],
  "pharmacy_notes": "Any special instructions or warnings from the prescription"
}}"""


# ============================================================================
# UTILITY FUNCTIONS
# ============================================================================

def get_prompt(template_name: str, **kwargs) -> str:
    """
    Get a prompt template and fill in variables.
    
    Args:
        template_name: Name of the template (e.g., 'PRESCRIPTION_ANALYSIS_PROMPT')
        **kwargs: Variables to fill in the template
        
    Returns:
        Formatted prompt string
    """
    templates = {
        'prescription_analysis': PRESCRIPTION_ANALYSIS_PROMPT,
        'prescription_explanation': PRESCRIPTION_EXPLANATION_PROMPT,
        'medical_report_analysis': MEDICAL_REPORT_ANALYSIS_PROMPT,
        'medical_report_summary': MEDICAL_REPORT_SUMMARY_PROMPT,
        'rag_medical_qa': RAG_MEDICAL_QA_PROMPT,
        'rag_symptom_analysis': RAG_SYMPTOM_ANALYSIS_PROMPT,
        'medication_interaction': MEDICATION_INTERACTION_PROMPT,
        'medication_side_effects': MEDICATION_SIDE_EFFECTS_PROMPT,
        'symptom_assessment': SYMPTOM_ASSESSMENT_PROMPT,
        'differential_diagnosis': DIFFERENTIAL_DIAGNOSIS_PROMPT,
        'patient_education': PATIENT_EDUCATION_PROMPT,
        'medication_education': MEDICATION_EDUCATION_PROMPT,
        'clinical_summary': CLINICAL_SUMMARY_PROMPT,
        'risk_stratification': RISK_STRATIFICATION_PROMPT,
        'ocr_correction': OCR_CORRECTION_PROMPT,
        'structured_data_extraction': STRUCTURED_DATA_EXTRACTION_PROMPT,
    }
    
    template_name = template_name.lower().replace(' ', '_')
    
    if template_name not in templates:
        raise ValueError(f"Unknown template: {template_name}. Available: {list(templates.keys())}")
    
    template = templates[template_name]
    return template.format(**kwargs)


def list_prompts() -> list:
    """List all available prompt templates."""
    return [
        'prescription_analysis',
        'prescription_explanation',
        'medical_report_analysis',
        'medical_report_summary',
        'rag_medical_qa',
        'rag_symptom_analysis',
        'medication_interaction',
        'medication_side_effects',
        'symptom_assessment',
        'differential_diagnosis',
        'patient_education',
        'medication_education',
        'clinical_summary',
        'risk_stratification',
        'ocr_correction',
        'structured_data_extraction',
    ]
