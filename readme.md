
doc_content = """# MedExplain AI — Full Testing Guide (Postman)

## What Is Built So Far

| Phase | Feature | Status |
|-------|---------|--------|
| Phase 1 | Authentication (JWT register/login/protected routes) | ✅ |
| Phase 2 | File upload (Cloudinary + PostgreSQL) | ✅ |
| Phase 3 | AI Microservice skeleton (FastAPI + singletons) | ✅ |
| Phase 4 | Report Analysis (OCR + Groq + health_metrics) | ✅ |
| Phase 5 | Prescription Explainer (OCR + Groq + medicines) | ✅ |

## Step 3: AI Service Direct Tests (Phase 3)

### 3.1 FastAPI Health Check

| Field | Value |
|-------|-------|
| **Method** | GET |
| **URL** | `http://localhost:8000/health` |
| **Headers** | None |

**Expected Response (200):**
```json
{
  "status": "ok",
  "service": "medexplain-ai"
}
```

---

### 3.2 Test OCR Directly (FastAPI)

Use any image URL. For testing, upload a file to Cloudinary first (via Phase 2), or use a public URL.

| Field | Value |
|-------|-------|
| **Method** | POST |
| **URL** | `http://localhost:8000/ocr/extract` |
| **Headers** | `Content-Type: application/json` |
| **Body (raw JSON)** | See below |

```json
{
  "file_url": "https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1234567890/medexplain/reports/report_1234567890.pdf"
}
```

**Expected Response (200):**
```json
{
  "text": "Hemoglobin: 11.2 g/dL\nGlucose (Fasting): 140 mg/dL\n..."
}
```

**Note:** If the file is not accessible or has no text, you may get empty text or an error.

---

## Step 4: Report Analysis (Phase 4)

### 4.1 Analyze Report

This triggers the full pipeline: OCR → Groq LLM → save health metrics.

| Field | Value |
|-------|-------|
| **Method** | POST |
| **URL** | `http://localhost:3000/api/v1/reports/analyze/REPORT_ID_HERE` |
| **Headers** | `Authorization: Bearer YOUR_TOKEN_HERE` |
| **Body** | None (empty) |

Replace `REPORT_ID_HERE` with the actual ID from Step 2.1.

**Expected Response (200):**
```json
{
  "summary": {
    "hemoglobin": {
      "value": "11.2",
      "status": "Low",
      "explanation": "Below normal range. May indicate mild anemia."
    },
    "glucose_fasting": {
      "value": "140",
      "status": "High",
      "explanation": "Above normal range. May indicate elevated blood sugar."
    }
  },
  "overall_summary": "Two values are outside normal ranges. Consult a doctor.",
  "reportId": "550e8400-e29b-41d4-a716-446655440001"
}
```

**This may take 5–15 seconds** because it calls:
1. Cloudinary (download)
2. PaddleOCR (text extraction)
3. Groq API (LLM analysis)
4. PostgreSQL (save results)

---

### 4.2 Verify Health Metrics Saved

| Field | Value |
|-------|-------|
| **Method** | GET |
| **URL** | `http://localhost:3000/api/v1/reports` |
| **Headers** | `Authorization: Bearer YOUR_TOKEN_HERE` |

**Expected Response (200):**
```json
{
  "reports": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "summary": "Two values are outside normal ranges...",
      "health_metrics": [
        {
          "id": "770e8400-e29b-41d4-a716-446655440003",
          "metric_name": "hemoglobin",
          "metric_value": "11.2",
          "status": "Low",
          "explanation": "Below normal range. May indicate mild anemia."
        },
        {
          "id": "880e8400-e29b-41d4-a716-446655440004",
          "metric_name": "glucose_fasting",
          "metric_value": "140",
          "status": "High",
          "explanation": "Above normal range. May indicate elevated blood sugar."
        }
      ]
    }
  ]
}
```

Notice: `summary` is now filled, and `health_metrics` contains the AI-generated data.

---

### 4.3 Check Database Directly (Optional)

```powershell
cd my-app
npx prisma studio
```

- Open `health_metrics` table
- Verify rows exist with correct `report_id`
- Open `reports` table
- Verify `summary` column is updated

---

## Step 5: Prescription Explainer (Phase 5)

### 5.1 Explain Prescription

| Field | Value |
|-------|-------|
| **Method** | POST |
| **URL** | `http://localhost:3000/api/v1/prescriptions/explain/PRESCRIPTION_ID_HERE` |
| **Headers** | `Authorization: Bearer YOUR_TOKEN_HERE` |
| **Body** | None (empty) |

Replace `PRESCRIPTION_ID_HERE` with the ID from Step 2.2.

**Expected Response (200):**
```json
{
  "medicines": [
    {
      "name": "Paracetamol",
      "purpose": "Reduces fever and relieves mild to moderate pain",
      "dosage": "500mg, twice daily",
      "usage_instructions": "Take after meals with water",
      "side_effects": "Rare: skin rash, liver damage with overdose"
    },
    {
      "name": "Amoxicillin",
      "purpose": "Treats bacterial infections",
      "dosage": "250mg, three times daily",
      "usage_instructions": "Take with food",
      "side_effects": "Nausea, diarrhea, allergic rash"
    }
  ],
  "pharmacy_notes": "Complete full course even if symptoms improve",
  "prescriptionId": "660e8400-e29b-41d4-a716-446655440002"
}
```

**This may take 5–15 seconds** (OCR + LLM + database write).

---

### 5.2 Verify Medicines Saved

| Field | Value |
|-------|-------|
| **Method** | GET |
| **URL** | `http://localhost:3000/api/v1/prescriptions` |
| **Headers** | `Authorization: Bearer YOUR_TOKEN_HERE` |

**Note:** If you don't have a `GET /prescriptions` endpoint yet, check Prisma Studio directly.

**In Prisma Studio:**
- Open `medicines` table
- Verify rows exist with correct `prescription_id`
- Open `prescriptions` table
- Verify `extracted_text` column is updated with OCR text

---

## Step 6: Error Testing

### 6.1 Invalid Token

| Field | Value |
|-------|-------|
| **Method** | GET |
| **URL** | `http://localhost:3000/api/v1/reports` |
| **Headers** | `Authorization: Bearer invalid_token_here` |

**Expected:** `401 Unauthorized`

---

### 6.2 Upload Without File

| Field | Value |
|-------|-------|
| **Method** | POST |
| **URL** | `http://localhost:3000/api/v1/reports/upload` |
| **Headers** | `Authorization: Bearer YOUR_TOKEN_HERE` |
| **Body** | `form-data` with only `reportName`, no `file` |

**Expected:** `400 Bad Request` — "No file provided"

---

### 6.3 Analyze Non-Existent Report

| Field | Value |
|-------|-------|
| **Method** | POST |
| **URL** | `http://localhost:3000/api/v1/reports/analyze/00000000-0000-0000-0000-000000000000` |
| **Headers** | `Authorization: Bearer YOUR_TOKEN_HERE` |

**Expected:** `404 Not Found` — "Report not found"

---

### 6.4 OCR Invalid URL

| Field | Value |
|-------|-------|
| **Method** | POST |
| **URL** | `http://localhost:8000/ocr/extract` |
| **Headers** | `Content-Type: application/json` |
| **Body** | `{ "file_url": "https://invalid-url.com/fake.pdf" }` |

**Expected:** `400` or `500` error — download failed

---

## Postman Collection Tips

### Create a Collection
1. Open Postman
2. Click "New" → "Collection"
3. Name it "MedExplain AI"

### Set Collection Variables
| Variable | Initial Value | Description |
|----------|--------------|-------------|
| `base_url` | `http://localhost:3000/api/v1` | Node backend |
| `ai_url` | `http://localhost:8000` | FastAI service |
| `token` | *(empty)* | Filled after login |

### Use Variables in Requests
- URL: `{{base_url}}/auth/login`
- Header: `Authorization: Bearer {{token}}`

### Set Token Automatically (Tests Tab)
In the **Login** request, go to **Tests** tab and add:
```javascript
var jsonData = pm.response.json();
pm.collectionVariables.set("token", jsonData.token);
```

This automatically saves the token after every login, so you don't have to copy-paste it manually.

---

## Full Endpoint Summary

| Phase | Method | Endpoint | Auth | Body | Description |
|-------|--------|----------|------|------|-------------|
| 1 | POST | `/auth/register` | No | JSON | Create account |
| 1 | POST | `/auth/login` | No | JSON | Get JWT token |
| 2 | POST | `/reports/upload` | Yes | form-data | Upload report file |
| 2 | POST | `/prescriptions/upload` | Yes | form-data | Upload prescription |
| 2 | GET | `/reports` | Yes | — | List user reports |
| 3 | GET | `/health` | No | — | AI service health |
| 3 | POST | `/ocr/extract` | No | JSON | Direct OCR test |
| 4 | POST | `/reports/analyze/:id` | Yes | — | Analyze report |
| 5 | POST | `/prescriptions/explain/:id` | Yes | — | Explain prescription |

---

## Troubleshooting

| Problem | Cause | Fix |
|---------|-------|-----|
| `401 Unauthorized` | Token missing or expired | Re-login, copy new token |
| `500 Internal Server Error` | AI service not running | Start `uvicorn` in Terminal 1 |
| OCR returns empty text | Image has no readable text / bad quality | Use clearer image |
| Groq returns malformed JSON | Prompt not strict enough / OCR text garbled | Check OCR output quality |
| Analysis takes >30 seconds | Slow internet / model downloading | Normal on first run, wait |
| Cloudinary upload fails | Wrong credentials / unsigned uploads disabled | Check Cloudinary dashboard |
| `ModuleNotFoundError` in FastAPI | Missing Python package | `pip install <package>` |

---

## Success Checklist

After completing all tests above, verify:

- [ ] User can register and login
- [ ] JWT token is returned and works on protected routes
- [ ] Report PDF/image uploads to Cloudinary
- [ ] Prescription image uploads to Cloudinary
- [ ] Uploaded files appear in Prisma Studio (reports/prescriptions tables)
- [ ] FastAI `/health` responds OK
- [ ] OCR extracts text from a Cloudinary URL
- [ ] Report analysis returns structured health metrics
- [ ] Health metrics are saved to PostgreSQL
- [ ] Prescription explanation returns medicine details
- [ ] Medicines are saved to PostgreSQL
- [ ] All error cases return proper status codes

---

*Document Version: 1.0*  
*Generated: May 2026*
"""

with open('/mnt/agents/output/Postman_Testing_Guide_Phase1-5.md', 'w', encoding='utf-8') as f:
    f.write(doc_content)

print("Postman testing guide created successfully")
