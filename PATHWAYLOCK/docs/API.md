# PathwayLock API Documentation

Base URL: `http://localhost:8000`

---

## Health Check

### GET /api/health

Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "service": "PathwayLock API",
  "version": "1.0.0"
}
```

---

## Beneficiaries

### POST /api/beneficiaries

Create a new beneficiary profile.

**Request Body:**
```json
{
  "name": "Rekha",
  "age": 24,
  "education": "10th Pass",
  "location": "Mumbai",
  "current_livelihood": "Home-based stitching",
  "skills": ["stitching", "measurements", "basic tailoring"],
  "traditional_skills": ["embroidery"],
  "aspiration": "Tailoring",
  "mobility_radius_km": 5.0,
  "work_preference": "flexible",
  "constraints": ["childcare", "flexible hours needed"],
  "training_history": [],
  "voice_transcript": "..."
}
```

**Response:** `201 Created`
```json
{
  "id": 1,
  "name": "Rekha",
  ...
  "created_at": "2026-09-29T08:00:00Z",
  "updated_at": "2026-09-29T08:00:00Z"
}
```

### GET /api/beneficiaries/{id}

Get beneficiary by ID.

**Response:** `200 OK`

### GET /api/beneficiaries

List all beneficiaries.

**Query Parameters:**
- `skip` (int): Offset for pagination
- `limit` (int): Limit results

---

## Profile Extraction

### POST /api/profile/extract

Extract structured profile from text/voice using AI.

**Request Body:**
```json
{
  "text": "My name is Rekha...",
  "voice_transcript": "..." 
}
```

**Response:** `200 OK`
```json
{
  "name": {
    "value": "Rekha",
    "confidence": 0.95
  },
  "age": {
    "value": 24,
    "confidence": 0.90
  },
  ...
  "raw_text": "..."
}
```

**Error:** `503 Service Unavailable` (if GEMINI_API_KEY not configured)

---

## Opportunities

### GET /api/opportunities

List opportunities with optional filters.

**Query Parameters:**
- `occupation` (string): Filter by occupation
- `location` (string): Filter by location
- `max_distance` (float): Maximum distance in km

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "title": "Tailoring Assistant",
    "occupation": "Tailoring",
    "location": "Dharavi, Mumbai",
    "distance_km": 2.8,
    "employment_type": "full-time",
    "required_skills": ["stitching", "basic tailoring"],
    "qualification": "10th Pass",
    "source": "Local Garment Cooperative Survey",
    "source_type": "FIELD_VERIFIED",
    "last_verified_at": "2026-09-17T08:00:00Z",
    "verification_status": "COUNSELLOR_VERIFIED",
    "confidence": 0.92,
    "description": "...",
    "created_at": "2026-09-01T08:00:00Z",
    "updated_at": "2026-09-17T08:00:00Z"
  }
]
```

### GET /api/opportunities/{id}

Get opportunity by ID.

### GET /api/opportunities/coverage/{occupation}

Get coverage status for an occupation.

**Response:** `200 OK`
```json
{
  "id": 1,
  "occupation": "Tailoring",
  "location": "Mumbai",
  "status": "SEARCHED_FOUND",
  "last_searched_at": "2026-09-24T08:00:00Z",
  "opportunities_count": 3,
  "created_at": "2026-09-01T08:00:00Z",
  "updated_at": "2026-09-24T08:00:00Z"
}
```

---

## NSQF Pathways

### GET /api/nsqf/pathways

List NSQF pathways.

**Query Parameters:**
- `occupation` (string): Filter by occupation

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "occupation": "Tailoring",
    "role": "Tailoring Assistant",
    "nsqf_level": 3,
    "required_skills": ["stitching", "measurements", "basic tailoring"],
    "skill_gaps": ["pattern making", "advanced stitching"],
    "training_pathway": {
      "course_name": "Basic Tailoring and Garment Construction",
      "provider": "National Skill Development Corporation",
      "duration_months": 3,
      "modules": ["Basic stitching", "Measurements", "Pattern basics"]
    },
    "training_duration_months": 3,
    "training_availability": "Available",
    "source_label": "NSQF Level 3 - Apparel Sector",
    "created_at": "2026-09-01T08:00:00Z",
    "updated_at": "2026-09-01T08:00:00Z"
  }
]
```

### GET /api/nsqf/pathways/{id}

Get pathway by ID.

---

## Recommendations

### POST /api/recommendations/generate

Generate PathwayLock recommendation for a beneficiary.

**Request Body:**
```json
{
  "beneficiary_id": 1
}
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "beneficiary_id": 1,
  "opportunity_id": 1,
  "nsqf_pathway_id": 1,
  "decision": "GREEN",
  "overall_score": 0.78,
  "opportunity_confidence": 0.92,
  "skill_fit": 0.85,
  "aspiration_match": 1.0,
  "distance_score": 1.0,
  "employment_type_score": 0.9,
  "training_accessibility_score": 1.0,
  "coverage_status": "SEARCHED_FOUND",
  "matched_skills": ["stitching", "measurements", "basic tailoring"],
  "skill_gaps": ["pattern making", "advanced stitching"],
  "explanation": "Pathway validated with high confidence...",
  "counsellor_status": "PENDING",
  "counsellor_notes": null,
  "reviewed_by": null,
  "reviewed_at": null,
  "created_at": "2026-09-29T08:00:00Z",
  "updated_at": "2026-09-29T08:00:00Z",
  "beneficiary": {...},
  "opportunity": {...},
  "nsqf_pathway": {...}
}
```

### GET /api/recommendations/{id}

Get recommendation by ID.

### GET /api/recommendations

List recommendations.

**Query Parameters:**
- `beneficiary_id` (int): Filter by beneficiary
- `decision` (string): Filter by decision (GREEN/YELLOW/RED)
- `counsellor_status` (string): Filter by counsellor status
- `skip` (int): Offset
- `limit` (int): Limit

---

## Counsellor

### POST /api/counsellor/review

Submit counsellor review for a recommendation.

**Request Body:**
```json
{
  "recommendation_id": 1,
  "status": "COUNSELLOR_VERIFIED",
  "notes": "Verified. Good match. Training pathway clear.",
  "reviewer": "Demo Counsellor"
}
```

**Status options:**
- `COUNSELLOR_VERIFIED`
- `MORE_EVIDENCE_REQUIRED`
- `REJECTED`

**Response:** `200 OK`
```json
{
  "recommendation_id": 1,
  "status": "COUNSELLOR_VERIFIED",
  "notes": "Verified. Good match. Training pathway clear.",
  "reviewer": "Demo Counsellor",
  "reviewed_at": "2026-09-29T08:10:00Z"
}
```

### GET /api/counsellor/pending

Get all recommendations pending counsellor review.

**Response:** `200 OK` (array of recommendations)

### GET /api/counsellor/reviewed

Get reviewed recommendations.

**Query Parameters:**
- `status` (string): Filter by counsellor status

---

## Audit

### GET /api/audit/{entity_id}

Get audit trail for an entity.

**Query Parameters:**
- `entity_type` (string): Entity type (default: "recommendation")

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "entity_type": "recommendation",
    "entity_id": 1,
    "action": "created",
    "actor": "system",
    "changes": null,
    "metadata": {
      "decision": "GREEN",
      "overall_score": 0.78
    },
    "created_at": "2026-09-29T08:00:00Z"
  },
  {
    "id": 2,
    "entity_type": "counsellor_review",
    "entity_id": 1,
    "action": "reviewed",
    "actor": "Demo Counsellor",
    "changes": {
      "old_status": "PENDING",
      "new_status": "COUNSELLOR_VERIFIED"
    },
    "metadata": {
      "notes": "Verified..."
    },
    "created_at": "2026-09-29T08:10:00Z"
  }
]
```

---

## Sync

### POST /api/sync

Sync offline data to server.

**Request Body:**
```json
{
  "entity_type": "beneficiary",
  "data": {...},
  "client_timestamp": "2026-09-29T08:00:00Z"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "entity_id": 1,
  "message": "Beneficiary synced successfully"
}
```

---

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "detail": "Validation error message"
}
```

### 404 Not Found
```json
{
  "detail": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "detail": "Internal server error"
}
```

### 503 Service Unavailable
```json
{
  "detail": "AI profile extraction is not configured..."
}
```

---

## Interactive Documentation

FastAPI provides automatic interactive API documentation:

- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc

These interfaces allow you to:
- View all endpoints
- See request/response schemas
- Test API calls directly
- Download OpenAPI spec

---

## Rate Limiting (Production)

In production, implement rate limiting:
- 100 requests per minute per IP
- 1000 requests per hour per IP
- Authenticated users: higher limits

---

## Authentication (Future)

Production will implement JWT-based authentication:

```
Authorization: Bearer <token>
```

Endpoints requiring authentication will return `401 Unauthorized` if token is missing or invalid.
