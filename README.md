# PATHWAYLOCK

**AI-Assisted, Voice-First Livelihood Pathway Validation**

Smart India Hackathon 2026 - PS 26097

---

## Overview

PathwayLock is a working MVP that validates livelihood pathways for SC communities under the GIA component of PM-AJAY. It combines beneficiary profiles, local opportunity intelligence, and NSQF-aligned skill mapping with a deterministic decision engine to produce GREEN/YELLOW/RED recommendations with full explainability.

This is a **real, working prototype** - not a UI mockup.

---

## Architecture

**Frontend:**
- React + TypeScript + Vite
- Tailwind CSS
- IndexedDB for offline support

**Backend:**
- Python FastAPI
- SQLAlchemy ORM
- SQLite (production-ready for PostgreSQL migration)

**AI:**
- Gemini API for profile extraction
- Deterministic rule engine for PathwayLock decisions

**Voice:**
- Browser Speech Recognition (prototype)
- Abstracted for future BHASHINI integration

---

## Project Structure

```
PATHWAYLOCK/
├── frontend/          # React TypeScript application
├── backend/           # FastAPI Python backend
├── database/          # SQLite database files
├── data/              # Prototype datasets
├── docs/              # Documentation
├── scripts/           # Setup and utility scripts
└── README.md
```

---

## Setup Instructions

### Prerequisites

- Node.js v18+
- Python 3.10+
- npm or yarn

### Environment Variables

Create `.env` files:

**backend/.env:**
```
GEMINI_API_KEY=your_gemini_api_key_here
DATABASE_URL=sqlite:///./pathwaylock.db
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

**frontend/.env:**
```
VITE_API_URL=http://localhost:8000
```

### Installation

```bash
# Backend
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python -m database.init_db

# Frontend
cd ../frontend
npm install
```

---

## Running the Application

### Start Backend
```bash
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
uvicorn main:app --reload --port 8000
```

Backend runs on: http://localhost:8000
API docs: http://localhost:8000/docs

### Start Frontend
```bash
cd frontend
npm run dev
```

Frontend runs on: http://localhost:5173

---

## Demo Flow

### Complete User Journey (2 minutes)

1. **Landing Page**
   - Click "Start Assessment"

2. **Beneficiary Assessment**
   - Option 1: Click "Start Voice Intake" (use microphone)
   - Option 2: Fill form manually
   - Demo profile: Rekha, 24, Tailoring skills

3. **AI Profile Extraction**
   - View extracted profile with confidence scores
   - Edit if needed
   - Confirm profile

4. **Opportunity Intelligence**
   - View matched local opportunities
   - See evidence sources and verification status
   - Coverage: SEARCHED_FOUND / NEVER_SEARCHED

5. **PathwayLock Recommendation**
   - View GREEN/YELLOW/RED decision
   - See score breakdown
   - Read explainable recommendation
   - View NSQF training pathway

6. **Counsellor Review**
   - Switch to counsellor dashboard
   - Review pending recommendations
   - Approve/Edit/Request More Evidence
   - View audit trail

---

## Demo Cases

### Case 1: GREEN Decision
- **Profile:** Rekha, 24, 10th pass, tailoring skills
- **Aspiration:** Tailoring
- **Opportunity:** Tailoring Assistant, 2.8km, counsellor verified
- **Result:** GREEN ✓

### Case 2: RED_UNCOVERED
- **Profile:** Beauty assistant aspiration
- **Coverage:** NEVER_SEARCHED
- **Result:** RED - Evidence not yet established

### Case 3: YELLOW Decision
- **Profile:** Embroidery skills
- **Opportunity:** Exists but unverified, 95 days old
- **Result:** YELLOW - Opportunity exists but confidence insufficient

---

## PathwayLock Decision Logic

### GREEN Requirements
- Overall score ≥ 0.70
- Opportunity confidence ≥ 0.75
- Counsellor verified
- Coverage searched
- Training pathway exists

### YELLOW Triggers
- Overall score ≥ 0.50
- Coverage searched
- BUT: Low confidence OR unverified OR stale

### RED Triggers
- No eligible opportunity
- Coverage never searched
- Opportunity confidence < 0.40
- No viable training pathway

---

## Key Features

✅ **Real AI Integration** - Gemini API for profile extraction  
✅ **Deterministic Rules** - LLM assists, engine decides  
✅ **Voice Input** - Browser speech recognition (prototype)  
✅ **Offline Support** - IndexedDB with sync queue  
✅ **Counsellor Workflow** - Review, approve, audit trail  
✅ **Explainable AI** - Full decision transparency  
✅ **Opportunity Intelligence** - Evidence-based matching  
✅ **NSQF Alignment** - Structured training pathways  

---

## Technical Highlights

- **No fake buttons** - Every action performs real operations
- **Structured data** - Prototype datasets with proper schemas
- **Production-ready** - SQLite → PostgreSQL migration path
- **Security** - API keys server-side, input validation
- **Professional UI** - Government/public service design system
- **Audit logging** - Complete decision trail

---

## Known Limitations

1. **Voice Input:** Browser API only (BHASHINI integration pending)
2. **AI Provider:** Gemini API required (configure in .env)
3. **Dataset:** Prototype opportunities (real integration pending)
4. **Offline:** Queue only, AI requires connectivity
5. **Auth:** Demo mode (production auth pending)

---

## API Endpoints

```
GET  /api/health
POST /api/beneficiaries
GET  /api/beneficiaries/{id}
POST /api/profile/extract
GET  /api/opportunities
GET  /api/opportunities/{id}
GET  /api/nsqf/pathways
POST /api/recommendations/generate
GET  /api/recommendations/{id}
POST /api/counsellor/review
GET  /api/audit/{id}
POST /api/sync
```

Full API documentation: http://localhost:8000/docs

---

## Testing

```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test

# Manual test complete flow
npm run demo
```

---

## Production Checklist

- [ ] Replace SQLite with PostgreSQL
- [ ] Integrate BHASHINI for multilingual voice
- [ ] Connect real opportunity data sources
- [ ] Add authentication and authorization
- [ ] Implement proper session management
- [ ] Add rate limiting and security hardening
- [ ] Deploy with proper secrets management
- [ ] Add monitoring and logging
- [ ] Performance optimization
- [ ] Accessibility audit

---

## Support

SIH 2026 Team Contact:
- Project: PathwayLock
- Problem Statement: PS 26097
- Category: AI-Driven Livelihood Mapping

---

**This is a working prototype built for Smart India Hackathon 2026.**
