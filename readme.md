# MedExplain AI

> AI-powered healthcare assistance platform that simplifies complex medical language into understandable explanations.

## Project Overview

MedExplain AI helps patients, elderly users, and non-medical individuals understand their medical reports and prescriptions without relying on unreliable internet sources. The platform uses advanced OCR, Large Language Models (LLM), and Retrieval-Augmented Generation (RAG) to provide accurate, personalized medical insights.

### Core Capabilities

- **Medical Report Analyzer** — Upload PDF or image-based medical reports; the system extracts text via OCR, analyzes values, and generates simple explanations with structured health metrics.
- **Prescription Explainer** — Upload prescription images to detect medicine names, understand purpose, dosage, and side effects.
- **Health Dashboard** — Visualize health metrics over time, track trends, and flag high/low values.
- **AI Chat Assistant** — Ask medical questions grounded in your uploaded reports and medical knowledge via RAG.
- **Voice Assistant** — Speech-to-text input and text-to-speech responses for accessibility.

### Target Users

- **Primary:** Patients, elderly users, non-medical individuals, students
- **Secondary:** Clinics, small hospitals, medical assistants

---

## Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **Next.js** | React framework (App Router / Pages Router) |
| **TypeScript** | Type-safe development |
| **Tailwind CSS** | Utility-first styling |
| **ShadCN UI** | Accessible, composable UI components |
| **Axios** | HTTP client for API communication |
| **React Query** | Server-state management |
| **Recharts** | Health analytics & trend visualizations |

**Deployment:** Vercel

### Backend API
| Technology | Purpose |
|------------|---------|
| **Node.js** | Runtime environment |
| **Express.js** | REST API framework |
| **PostgreSQL (Neon)** | Relational database |
| **Prisma ORM** | Database schema management & querying |
| **JWT (jsonwebtoken)** | Stateless authentication |
| **bcryptjs** | Password hashing (salt rounds: 10) |
| **Multer** | Multipart file upload handling |
| **Cloudinary SDK** | Cloud file storage & CDN |

**Deployment:** Render

### AI Microservice
| Technology | Purpose |
|------------|---------|
| **FastAPI** | High-performance Python API for AI workloads |
| **LangChain** | LLM orchestration & prompt management |
| **PaddleOCR** | Text extraction from PDFs and images |
| **Groq API** | LLM inference (model: `llama-3.1-8b-instant`) |
| **Sentence Transformers** | Embedding generation (`BAAI/bge-small-en`, `all-MiniLM-L6-v2`) |
| **ChromaDB** | Vector database for RAG retrieval |
| **Faster Whisper** | Speech-to-text transcription |
| **Edge TTS** | Text-to-speech audio generation |

**Deployment:** Render (initial) → RunPod (future scaling)

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
│  │  Node.js + Express (Backend API)                            │   │
│  │  • JWT Auth  • User APIs  • File handling                 │   │
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
│  │  │  PaddleOCR  │  │  Groq API   │  │  SentenceTransformers│  │   │
│  │  │  (OCR)      │  │  (LLM)      │  │  (Embeddings)        │  │   │
│  │  └─────────────┘  └─────────────┘  └─────────────────────┘  │   │
│  │                                                             │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │   │
│  │  │FasterWhisper│  │   Edge TTS  │  │     ChromaDB        │  │   │
│  │  │  (STT)      │  │  (TTS)      │  │  (Vector Store)     │  │   │
│  │  └─────────────┘  └─────────────┘  └─────────────────────┘  │   │
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
User uploads report image/PDF
    ↓
Next.js → POST /api/v1/reports/upload
    ↓
Express + Multer → Cloudinary Upload
    ↓
Prisma saves file_url to `reports` table
    ↓
User clicks "Analyze"
    ↓
POST /api/v1/reports/analyze/:id
    ↓
Express sends Cloudinary URL to FastAPI /ocr
    ↓
PaddleOCR extracts raw text
    ↓
Prompt Template + OCR text → Groq Llama3
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
FastAPI: OCR → Medicine Detection → LLM Explanation
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
Groq Llama3 generates grounded response
    ↓
Express saves exchange to `chat_history`
    ↓
Frontend displays AI response
```

### 4. Voice Assistant Pipeline
```
Microphone captures audio
    ↓
Faster Whisper (Speech-to-Text)
    ↓
Text processed through RAG Chat Pipeline
    ↓
LLM response generated
    ↓
Edge TTS (Text-to-Speech)
    ↓
Audio playback to user
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

## API Overview

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | No | Register new user |
| POST | `/auth/login` | No | Login user |
| POST | `/reports/upload` | Yes | Upload report file |
| POST | `/reports/analyze/:id` | Yes | Analyze uploaded report |
| GET | `/reports` | Yes | Get all user reports |
| POST | `/prescriptions/upload` | Yes | Upload prescription |
| POST | `/prescriptions/explain/:id` | Yes | Explain prescription |
| POST | `/chat` | Yes | AI chat message |

---

## Authentication

- **JWT-only** authentication (no refresh token rotation)
- **bcrypt** password hashing with salt rounds = 10
- Token stored in browser `localStorage`
- Attached to every request via `Authorization: Bearer <token>` header
- Middleware-based route protection on both frontend and backend

---

## Key AI Models & Tools

| Component | Tool / Model |
|-----------|--------------|
| LLM Provider | Groq API |
| Recommended Model | `llama-3.1-8b-instant` |
| OCR | PaddleOCR |
| Embeddings | `BAAI/bge-small-en`, `all-MiniLM-L6-v2` |
| Vector Database | ChromaDB |
| Speech-to-Text | `faster-whisper` |
| Text-to-Speech | Edge TTS |

---

## MVP Scope

- [x] Authentication (JWT, login/signup)
- [x] Report upload (PDF/image)
- [x] Prescription upload (image)
- [x] Cloudinary file storage
- [x] PostgreSQL + Prisma ORM setup
- [ ] OCR extraction & AI report simplification *(Phase 3–4)*
- [ ] Prescription medicine detection & explanation *(Phase 5)*
- [ ] Health Dashboard with visualizations *(Phase 6)*
- [ ] RAG Chatbot *(Phase 7)*
- [ ] Voice Assistant *(Phase 7)*

## Future Scope

- Multi-language support
- Doctor dashboard
- Appointment integration
- Health recommendations engine
- Fine-tuned medical LLM
- Native mobile application

---

## Non-Functional Requirements

| Category | Requirement |
|----------|-------------|
| **Performance** | Response under 5 seconds for most operations |
| **Security** | JWT authentication, password hashing, protected APIs |
| **Scalability** | Separate AI microservice, modular architecture |

---
## Getting Started

### Prerequisites
- Node.js 20+
- Python 3.11+
- Neon PostgreSQL account
- Cloudinary account
- Groq API key


