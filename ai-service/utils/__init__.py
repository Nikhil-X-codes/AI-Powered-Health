"""
Utilities Package
Text processing, file handling, and prompt templates for AI pipelines.
"""

# File Downloader
from .file_downloader import (
    download_file,
    save_to_temp_file,
    pdf_to_images,
    convert_pdf_to_image,
    download_and_convert,
    get_file_info,
    cleanup_temp_file,
    FileDownloadContext,
)

# Text Chunker
from .text_chunker import (
    TextChunker,
    chunk_text,
    chunk_text_with_metadata,
    chunk_medical_report,
    estimate_tokens,
    split_by_token_limit,
)

# Prompt Templates
from .prompts import (
    get_prompt,
    list_prompts,
    # Template constants
    PRESCRIPTION_ANALYSIS_PROMPT,
    PRESCRIPTION_EXPLANATION_PROMPT,
    MEDICAL_REPORT_ANALYSIS_PROMPT,
    MEDICAL_REPORT_SUMMARY_PROMPT,
    RAG_MEDICAL_QA_PROMPT,
    RAG_SYMPTOM_ANALYSIS_PROMPT,
    MEDICATION_INTERACTION_PROMPT,
    MEDICATION_SIDE_EFFECTS_PROMPT,
    SYMPTOM_ASSESSMENT_PROMPT,
    DIFFERENTIAL_DIAGNOSIS_PROMPT,
    PATIENT_EDUCATION_PROMPT,
    MEDICATION_EDUCATION_PROMPT,
    CLINICAL_SUMMARY_PROMPT,
    RISK_STRATIFICATION_PROMPT,
    OCR_CORRECTION_PROMPT,
    STRUCTURED_DATA_EXTRACTION_PROMPT,
    MEDICAL_REPORT_METRICS_PROMPT,
    PRESCRIPTION_EXPLAINER_PROMPT,
)

__all__ = [
    # File Downloader
    "download_file",
    "save_to_temp_file",
    "pdf_to_images",
    "convert_pdf_to_image",
    "download_and_convert",
    "get_file_info",
    "cleanup_temp_file",
    "FileDownloadContext",
    # Text Chunker
    "TextChunker",
    "chunk_text",
    "chunk_text_with_metadata",
    "chunk_medical_report",
    "estimate_tokens",
    "split_by_token_limit",
    # Prompts
    "get_prompt",
    "list_prompts",
    "PRESCRIPTION_ANALYSIS_PROMPT",
    "PRESCRIPTION_EXPLANATION_PROMPT",
    "MEDICAL_REPORT_ANALYSIS_PROMPT",
    "MEDICAL_REPORT_SUMMARY_PROMPT",
    "RAG_MEDICAL_QA_PROMPT",
    "RAG_SYMPTOM_ANALYSIS_PROMPT",
    "MEDICATION_INTERACTION_PROMPT",
    "MEDICATION_SIDE_EFFECTS_PROMPT",
    "SYMPTOM_ASSESSMENT_PROMPT",
    "DIFFERENTIAL_DIAGNOSIS_PROMPT",
    "PATIENT_EDUCATION_PROMPT",
    "MEDICATION_EDUCATION_PROMPT",
    "CLINICAL_SUMMARY_PROMPT",
    "RISK_STRATIFICATION_PROMPT",
    "OCR_CORRECTION_PROMPT",
    "STRUCTURED_DATA_EXTRACTION_PROMPT",
    "MEDICAL_REPORT_METRICS_PROMPT",
    "PRESCRIPTION_EXPLAINER_PROMPT",
]
