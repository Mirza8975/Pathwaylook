# PathwayLock Architecture

**AI-Assisted, Voice-First Livelihood Pathway Validation**

---

## System Overview

PathwayLock is a full-stack web application that validates livelihood pathways for SC communities under PM-AJAY GIA component. It combines beneficiary profiles, local opportunity intelligence, and NSQF-aligned skill mapping with a deterministic decision engine.

---

## Technology Stack

### Frontend
- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Routing:** React Router v6
- **HTTP Client:** Axios
- **Offline Storage:** IndexedDB

### Backend
- **Framework:** FastAPI (Python)
- **ORM:** SQLAlchemy
- **Database:** SQLite (MVP), PostgreSQL-ready
- **AI Service:** Google Gemini API
- **Validation:** Pydantic

### Voice
- **Current:** Browser Speech Recognition API
- **Future:** BHASHINI integration

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         FRONTEND                             │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Landing    │  │  Assessment  │  │ Voice Intake │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │Profile Review│  │ Opportunity  │  │Recommendation│     │
│  └──────────────┘  │ Intelligence │  └──────────────┘     │
│                    └──────────────┘                         │
│  ┌──────────────────────────────────────────────────┐     │
│  │          Counsellor Dashboard                     │     │
│  └──────────────────────────────────────────────────┘     │
│                                                              │
│  Services:                                                   │
│  - API Service (Axios)                                      │
│  - Voice Service (Browser API / BHASHINI)                  │
│  - Offline Service (IndexedDB)                             │
└─────────────────────────────────────────────────────────────┘
                             │
                             │ HTTP/REST
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                         BACKEND                              │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                   FastAPI App                         │  │
│  │                                                       │  │
│  │  API Endpoints:                                      │  │
│  │  - /api/beneficiaries                                │  │
│  │  - /api/profile/extract                              │  │
│  │  - /api/opportunities                                │  │
│  │  - /api/nsqf/pathways                                │  │
│  │  - /api/recommendations/generate                     │  │
│  │  - /api/counsellor/review                            │  │
│  │  - /api/audit                                        │  │
│  │  - /api/sync                                         │  │
│  └──────────────────────────────────────────────────────┘  │
│                             │                                │
│              ┌──────────────┼──────────────┐               │
│              ▼              ▼              ▼               │
│  ┌────────────────┐  ┌────────────┐  ┌────────────┐      │
│  │  AI Service    │  │PathwayLock │  │  Database  │      │
│  │                │  │   Engine   │  │  Access    │      │
│  │  - Gemini API  │  │            │  │            │      │
│  │  - Profile     │  │- Scoring   │  │- SQLAlchemy│      │
│  │    Extraction  │  │- Rules     │  │- Models    │      │
│  │                │  │- Decision  │  │- Queries   │      │
│  └────────────────┘  └────────────┘  └────────────┘      │
│                                              │              │
└──────────────────────────────────────────────┼──────────────┘
                                               ▼
                            ┌──────────────────────────────┐
                            │   SQLite Database            │
                            │                              │
                            │  Tables:                     │
                            │  - beneficiaries             │
                            │  - opportunities             │
                            │  - coverage                  │
                            │  - nsqf_pathways            │
                            │  - recommendations          │
                            │  - audit_logs               │
                            └──────────────────────────────┘
```

---

## Data Flow

### 1. Beneficiary Assessment Flow

```
User Input (Text/Voice)
      │
      ▼
AI Profile Extraction (Optional)
      │
      ▼
Profile Review & Confirmation
      │
      ▼
Beneficiary Record Saved
      │
      ▼
PathwayLock Recommendation Generation
```

### 2. PathwayLock Decision Flow

```
Beneficiary Profile
      │
      ▼
Find Matching Opportunities (by aspiration)
      │
      ▼
For Each Opportunity:
  ├─ Calculate Skill Fit
  ├─ Calculate Aspiration Match
  ├─ Calculate Distance Score
  ├─ Calculate Employment Type Score
  ├─ Calculate Training Accessibility
  └─ Apply Hard Constraints (mobility, etc.)
      │
      ▼
Select Best Opportunity
      │
      ▼
Calculate Opportunity Confidence
  ├─ Source Type Weight
  ├─ Verification Status Weight
  └─ Freshness (time decay)
      │
      ▼
Find NSQF Pathway
      │
      ▼
Apply Decision Rules
  ├─ Coverage Status Check
  ├─ Overall Score >= Threshold?
  ├─ Opportunity Confidence >= Threshold?
  ├─ Counsellor Verified?
  └─ Training Pathway Exists?
      │
      ▼
Decision: GREEN / YELLOW / RED / RED_UNCOVERED
      │
      ▼
Generate Explanation
      │
      ▼
Save Recommendation
```

### 3. Counsellor Review Flow

```
Pending Recommendations
      │
      ▼
Counsellor Reviews
      │
      ├─ Approve → COUNSELLOR_VERIFIED
      ├─ Request More Evidence → MORE_EVIDENCE_REQUIRED
      └─ Reject → REJECTED
      │
      ▼
Audit Log Created
      │
      ▼
Recommendation Status Updated
```

---

## Database Schema

### Beneficiaries
```
id, name, age, education, location, current_livelihood,
skills (JSON), traditional_skills (JSON), aspiration,
mobility_radius_km, work_preference, constraints (JSON),
training_history (JSON), voice_transcript, created_at, updated_at
```

### Opportunities
```
id, title, occupation, location, distance_km, employment_type,
required_skills (JSON), qualification, source, source_type,
last_verified_at, verification_status, confidence,
description, created_at, updated_at
```

### Coverage
```
id, occupation, location, status (SEARCHED_FOUND/SEARCHED_NONE/NEVER_SEARCHED),
last_searched_at, opportunities_count, created_at, updated_at
```

### NSQF Pathways
```
id, occupation, role, nsqf_level, required_skills (JSON),
skill_gaps (JSON), training_pathway (JSON),
training_duration_months, training_availability,
source_label, created_at, updated_at
```

### Recommendations
```
id, beneficiary_id, opportunity_id, nsqf_pathway_id,
decision, overall_score, opportunity_confidence,
skill_fit, aspiration_match, distance_score,
employment_type_score, training_accessibility_score,
coverage_status, matched_skills (JSON), skill_gaps (JSON),
explanation, counsellor_status, counsellor_notes,
reviewed_by, reviewed_at, created_at, updated_at
```

### Audit Logs
```
id, entity_type, entity_id, action, actor,
changes (JSON), metadata (JSON), created_at
```

---

## PathwayLock Decision Engine

### Scoring Algorithm

**Overall Score Calculation:**
```
overall_score = 
  (skill_fit × 0.35) +
  (aspiration_match × 0.20) +
  (distance_score × 0.15) +
  (employment_type_score × 0.15) +
  (training_accessibility × 0.15)
```

**Opportunity Confidence Calculation:**
```
opportunity_confidence = source_weight × verification_weight × freshness

Source Weights:
- FIELD_VERIFIED: 0.90
- PUBLIC_SOURCE: 0.85
- SAMPLE_DATA: 0.70
- SYNTHETIC: 0.30

Verification Weights:
- COUNSELLOR_VERIFIED: 1.0
- UNVERIFIED: 0.65

Freshness:
freshness = 0.5 ^ (days_since_verification / 120)
```

### Decision Rules

**GREEN:**
- overall_score >= 0.70
- opportunity_confidence >= 0.75
- counsellor_verified = true
- coverage_searched = true
- training_pathway_exists = true

**YELLOW:**
- overall_score >= 0.50
- coverage_searched = true
- BUT: Low confidence OR unverified OR stale

**RED:**
- overall_score < 0.50
- OR opportunity_confidence < 0.40
- OR no viable training pathway

**RED_UNCOVERED:**
- coverage_status = NEVER_SEARCHED

---

## API Endpoints

### Beneficiaries
- `POST /api/beneficiaries` - Create beneficiary
- `GET /api/beneficiaries/{id}` - Get beneficiary
- `GET /api/beneficiaries` - List beneficiaries

### Profile Extraction
- `POST /api/profile/extract` - Extract profile from text/voice

### Opportunities
- `GET /api/opportunities` - List opportunities (with filters)
- `GET /api/opportunities/{id}` - Get opportunity
- `GET /api/opportunities/coverage/{occupation}` - Get coverage status

### NSQF Pathways
- `GET /api/nsqf/pathways` - List pathways
- `GET /api/nsqf/pathways/{id}` - Get pathway

### Recommendations
- `POST /api/recommendations/generate` - Generate recommendation
- `GET /api/recommendations/{id}` - Get recommendation
- `GET /api/recommendations` - List recommendations

### Counsellor
- `POST /api/counsellor/review` - Submit counsellor review
- `GET /api/counsellor/pending` - Get pending reviews
- `GET /api/counsellor/reviewed` - Get reviewed recommendations

### Audit
- `GET /api/audit/{entity_id}` - Get audit trail

### Sync
- `POST /api/sync` - Sync offline data

---

## Security Considerations

1. **API Keys:** Stored server-side only (GEMINI_API_KEY in backend/.env)
2. **CORS:** Configured for specific origins
3. **Input Validation:** Pydantic schemas validate all inputs
4. **PII Protection:** No unnecessary government IDs collected
5. **SQL Injection:** SQLAlchemy ORM prevents SQL injection
6. **XSS Protection:** React auto-escapes output

---

## Deployment Architecture (Production)

```
┌─────────────────────────────────────────────────────┐
│                    Load Balancer                     │
└─────────────────────────────────────────────────────┘
                         │
          ┌──────────────┼──────────────┐
          ▼              ▼              ▼
    ┌─────────┐    ┌─────────┐    ┌─────────┐
    │Frontend │    │Frontend │    │Frontend │
    │ Server  │    │ Server  │    │ Server  │
    │ (Nginx) │    │ (Nginx) │    │ (Nginx) │
    └─────────┘    └─────────┘    └─────────┘
          │              │              │
          └──────────────┼──────────────┘
                         │
          ┌──────────────┼──────────────┐
          ▼              ▼              ▼
    ┌─────────┐    ┌─────────┐    ┌─────────┐
    │ Backend │    │ Backend │    │ Backend │
    │FastAPI  │    │FastAPI  │    │FastAPI  │
    └─────────┘    └─────────┘    └─────────┘
          │              │              │
          └──────────────┼──────────────┘
                         │
                         ▼
              ┌──────────────────┐
              │   PostgreSQL     │
              │   (Primary)      │
              └──────────────────┘
                         │
                         ▼
              ┌──────────────────┐
              │   PostgreSQL     │
              │   (Replica)      │
              └──────────────────┘
```

---

## Future Enhancements

1. **BHASHINI Integration:** Multilingual voice input
2. **Real Data Sources:** Government portals, NGO networks
3. **Authentication:** OAuth2/JWT for user management
4. **Field Verification App:** Mobile app for counsellors
5. **Analytics Dashboard:** Trend analysis, success metrics
6. **SMS Integration:** Notifications and updates
7. **Offline Mobile App:** React Native version
8. **ML Model Training:** Custom models on historical data

---

## Performance Considerations

- **Database Indexing:** on aspiration, occupation, location
- **Caching:** Redis for frequently accessed data
- **Lazy Loading:** Frontend pagination
- **API Rate Limiting:** Prevent abuse
- **CDN:** Static asset delivery
- **Database Connection Pooling:** SQLAlchemy pool

---

## Monitoring & Logging

- **Application Logs:** Structured logging (JSON)
- **Audit Trail:** Complete decision history
- **Error Tracking:** Sentry integration
- **Metrics:** Prometheus + Grafana
- **Uptime Monitoring:** Status page

---

## Testing Strategy

1. **Unit Tests:** Backend business logic
2. **Integration Tests:** API endpoints
3. **E2E Tests:** Complete user flows
4. **Load Tests:** Performance under load
5. **Security Tests:** Vulnerability scanning
6. **Accessibility Tests:** WCAG compliance

---

**This architecture supports:**
- Scalability (horizontal scaling)
- Maintainability (clean separation of concerns)
- Extensibility (plugin architecture for data sources)
- Reliability (fault tolerance, audit trails)
- Security (defense in depth)
