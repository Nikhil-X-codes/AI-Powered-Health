# Medzee.ai

> AI-powered healthcare assistance platform that simplifies complex medical language into understandable explanations.

## Project Overview

Medzee.ai helps patients, elderly users, and non-medical individuals understand their medical reports and prescriptions without relying on unreliable internet sources. The platform uses image preprocessing, confidence-gated Google Cloud Vision API text extraction, Large Language Models (LLM), and Retrieval-Augmented Generation (RAG) to provide accurate, personalized medical insights.

### Core Capabilities

- **Medical Report Analyzer** — Upload PDF or image-based medical reports; the system extracts text via the Google Cloud Vision API, analyzes values, and generates simple explanations with structured health metrics.
- **Prescription Explainer** — Upload prescription images to detect medicine names, understand purpose, dosage, and side effects.
- **Health Dashboard** — Visualize health metrics over time, track trends, and flag high/low values.
- **AI Chat Assistant** — Ask medical questions grounded in your uploaded reports and medical knowledge via RAG.
- **Chat History & Management** — View past conversations and delete chat sessions.
- **Voice Assistant** — Speech-to-text input and text-to-speech responses for accessibility.

### Vision API Quality Control

- Images are preprocessed before text extraction so shadows, blur, and tilt are reduced.
- Extraction confidence is computed as the average of word-level confidence scores.
- Low-confidence extractions (below 70%) are flagged to prevent using unverified text.
- Only verified text is sent into report analysis, prescription explanation, and RAG.

### Target Users

- **Primary:** Patients, elderly users, non-medical individuals, students
- **Secondary:** Clinics, small hospitals, medical assistants

---

## Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **Next.js 16.2** | React 19 framework (App Router) |
| **JavaScript** | Development language |
| **Tailwind CSS v4** | Utility-first styling with modern PostCSS pipeline |
| **Native Fetch & Axios** | HTTP clients for API communication |
| **Lucide React** | Modern, consistent icon library |
| **Recharts** | Health analytics & trend visualizations |

**Deployment:** Vercel

### Backend API (Next.js REST API Routes)
| Technology | Purpose |
|------------|---------|
| **Next.js App Router** | Backend REST endpoints |
| **PostgreSQL (Neon)** | Relational database for users, sessions, reports, and metrics |
| **Prisma ORM** | Database schema management & querying |
| **JWT (jsonwebtoken / jose)** | Stateless authentication |
| **bcryptjs** | Password hashing (salt rounds: 10) |
| **Cloudinary SDK** | Cloud file storage & CDN |

**Deployment:** Vercel (unified with Frontend)

### AI Microservice
| Technology | Purpose |
|------------|---------|
| **FastAPI** | High-performance Python API for AI workloads |
| **LangChain** | LLM orchestration & prompt management |
| **Google Cloud Vision API** | High-accuracy text extraction from PDFs and images |
| **Groq API** | LLM inference (model: `openai/gpt-oss-20b`) |
| **Fastembed** | Local embedding generation (`BAAI/bge-small-en-v1.5` via ONNX Runtime) |
| **ChromaDB** | Vector database for RAG retrieval |
| **Groq Whisper API** | Cloud-based speech-to-text transcription |
| **Edge TTS** | Text-to-speech audio generation |

**Deployment:** Render / RunPod

### File Storage
| Platform | Stores |
|----------|--------|
| **Cloudinary** | PDFs, report images, prescription images, voice files |

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                                 │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  Next.js (Frontend)                                         │   │
│  │  • Authentication UI  • Dashboard  • Report/Prescription    │   │
│  │    Upload  • Chat Interface  • Voice Recording              │   │
│  └────────────────────────┬────────────────────────────────────┘   │
└───────────────────────────┼─────────────────────────────────────────┘
                            │ HTTPS / REST
┌───────────────────────────┼─────────────────────────────────────────┐
│                         API LAYER                                    │
│  ┌────────────────────────▼────────────────────────────────────┐   │
│  │  Next.js App Router (REST API backend)                      │   │
│  │  • JWT Auth  • User APIs  • File handling (parseFormData)   │   │
│  │  • Prisma ORM → Neon PostgreSQL                           │   │
│  │  • Proxy to AI Service                                    │   │
│  └────────────────────────┬────────────────────────────────────┘   │
└───────────────────────────┼─────────────────────────────────────────┘
                            │ Internal HTTP
┌───────────────────────────┼─────────────────────────────────────────┐
│                         AI LAYER                                     │
│  ┌────────────────────────▼────────────────────────────────────┐   │
│  │  FastAPI (AI Microservice)                                  │   │
│  │                                                             │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │   │
│  │  │Google Vision│  │  Groq API   │  │      Fastembed      │  │   │
│  │  │ (Vision API)│  │ (LLM & STT) │  │  (Local Embeddings) │  │   │
│  │  └─────────────┘  └─────────────┘  └─────────────────────┘  │   │
│  │                                                             │   │
│  │                   ┌─────────────┐  ┌─────────────────────┐  │   │
│  │                   │  Edge TTS   │  │      ChromaDB       │  │   │
│  │                   │    (TTS)    │  │   (Vector Store)    │  │   │
│  │                   └─────────────┘  └─────────────────────┘  │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
                            │
┌───────────────────────────┼─────────────────────────────────────────┐
│                      DATA LAYER                                      │
│  ┌────────────────────────▼────────────────────────────────────┐   │
│  │  Neon PostgreSQL              │  ChromaDB                  │   │
│  │  • users  • reports            │  • Medical report          │   │
│  │  • health_metrics             │    embeddings              │   │
│  │  • prescriptions              │  • Prescription text       │   │
│  │  • medicines  • chat_history  │    chunks                  │   │
│  │                               │  • Medical knowledge       │   │
│  └──────────────────────────────┴────────────────────────────┘   │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  Cloudinary (External File Store)                           │   │
│  │  • PDFs  • Images  • Voice recordings                       │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Data Flow

### 1. Medical Report Analysis
```
User uploads report image
    ↓
Next.js → POST /api/v1/reports/upload
    ↓
Next.js parseFormData → Cloudinary Upload
    ↓
Prisma saves file_url to `reports` table
    ↓
User clicks "Analyze"
    ↓
POST /api/v1/reports/analyze/:id
    ↓
Next.js API route sends Cloudinary URL to FastAPI /ocr (for Vision API extraction)
    ↓
Google Cloud Vision API text extraction & confidence evaluation
    ↓
Confidence rating check (flagged if below 70% threshold)
    ↓
Prompt Template + extracted text → Groq (openai/gpt-oss-20b)
    ↓
Structured JSON (hemoglobin, glucose, etc.)
    ↓
Prisma bulk inserts into `health_metrics`
    ↓
Dashboard renders trends & explanations
```

### 2. Prescription Analysis
```
User uploads prescription image
    ↓
Next.js → POST /api/v1/prescriptions/upload
    ↓
Cloudinary → Prisma `prescriptions` table
    ↓
POST /api/v1/prescriptions/explain/:id
    ↓
FastAPI: Vision API → Medicine Detection → LLM Explanation
    ↓
Prisma inserts into `medicines` table
    ↓
Frontend displays: name, purpose, dosage, side effects
```

### 3. RAG Chat Pipeline
```
User sends message: "Why is my glucose high?"
    ↓
POST /api/v1/chat
    ↓
FastAPI: Generate embedding of query
    ↓
Search ChromaDB for relevant context
    ↓
Inject context + query into prompt
    ↓
Groq (openai/gpt-oss-20b) generates grounded response
    ↓
Next.js API route saves exchange to `chat_history`
    ↓
Frontend displays AI response
```

### 4. Voice Assistant Pipeline
```
User microphone captures audio
    ↓
Groq Whisper API (Speech-to-Text)
    ↓
Text processed through RAG Chat Pipeline
    ↓
LLM response generated
    ↓
Edge TTS (Text-to-Speech)
    ↓
Audio playback to user
```

### 5. Report/Prescription Deletion Flow
```
User clicks Delete and confirms modal
    ↓
Next.js → DELETE /api/v1/reports/:id or /api/v1/prescriptions/:id
    ↓
Next.js API route: Verifies user authorization and ownership
    ↓
Next.js API route: Extracts public ID & deletes files from Cloudinary
    ↓
Next.js API route: Calls FastAPI DELETE /embed/delete to clean ChromaDB RAG chunks
    ↓
Prisma deletes database record (cascading deletes metrics or medicines)
    ↓
Frontend: Refreshes overview list and routes back to overview page
```

---

## Database Schema (PostgreSQL)

| Table | Purpose |
|-------|---------|
| `users` | Authentication & profile data |
| `reports` | Uploaded medical report metadata & Cloudinary URLs |
| `health_metrics` | Extracted metrics (hemoglobin, glucose, etc.) with status & explanation |
| `prescriptions` | Uploaded prescription metadata & Cloudinary URLs |
| `medicines` | Detected medicines with usage, dosage, and side effects |
| `chat_history` | User-AI conversation logs |

---

## Key AI Models & Tools

| Component | Tool / Model |
|-----------|--------------|
| LLM Provider | Groq API |
| Recommended Model | `openai/gpt-oss-20b` |
| Vision API | Google Cloud Vision API |
| Embeddings | Fastembed (`BAAI/bge-small-en-v1.5` loaded locally) |
| Vector Database | ChromaDB |
| Speech-to-Text | Groq Whisper API |
| Text-to-Speech | Edge TTS |

---

## Future Scope

- Multi-language support
- Doctor dashboard
- Appointment integration
- Health recommendations engine
- Fine-tuned medical LLM
- Native mobile application

---


## Getting Started

### Prerequisites
- Node.js 20+
- Python 3.11+
- Neon PostgreSQL account
- Cloudinary account
- Groq API key


