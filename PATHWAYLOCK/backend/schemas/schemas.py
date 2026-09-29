"""
Pydantic schemas for request/response validation
"""
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

# Beneficiary Schemas
class BeneficiaryBase(BaseModel):
    name: str
    age: Optional[int] = None
    education: Optional[str] = None
    location: Optional[str] = None
    current_livelihood: Optional[str] = None
    skills: Optional[List[str]] = []
    traditional_skills: Optional[List[str]] = []
    aspiration: Optional[str] = None
    mobility_radius_km: Optional[float] = None
    work_preference: Optional[str] = None
    constraints: Optional[List[str]] = []
    training_history: Optional[List[str]] = []
    voice_transcript: Optional[str] = None

class BeneficiaryCreate(BeneficiaryBase):
    pass

class BeneficiaryResponse(BeneficiaryBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Profile Extraction Schemas
class ExtractedField(BaseModel):
    value: Any
    confidence: Optional[float] = None

class ProfileExtractionRequest(BaseModel):
    text: str
    voice_transcript: Optional[str] = None

class ProfileExtractionResponse(BaseModel):
    name: Optional[ExtractedField] = None
    age: Optional[ExtractedField] = None
    education: Optional[ExtractedField] = None
    location: Optional[ExtractedField] = None
    current_livelihood: Optional[ExtractedField] = None
    skills: Optional[ExtractedField] = None
    traditional_skills: Optional[ExtractedField] = None
    aspiration: Optional[ExtractedField] = None
    mobility_radius_km: Optional[ExtractedField] = None
    work_preference: Optional[ExtractedField] = None
    constraints: Optional[ExtractedField] = None
    training_history: Optional[ExtractedField] = None
    raw_text: str

# Opportunity Schemas
class OpportunityBase(BaseModel):
    title: str
    occupation: str
    location: str
    distance_km: Optional[float] = None
    employment_type: Optional[str] = None
    required_skills: Optional[List[str]] = []
    qualification: Optional[str] = None
    source: Optional[str] = None
    source_type: Optional[str] = None
    last_verified_at: Optional[datetime] = None
    verification_status: Optional[str] = None
    confidence: Optional[float] = None
    description: Optional[str] = None

class OpportunityResponse(OpportunityBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Coverage Schemas
class CoverageResponse(BaseModel):
    id: int
    occupation: str
    location: Optional[str] = None
    status: str
    last_searched_at: Optional[datetime] = None
    opportunities_count: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# NSQF Pathway Schemas
class NSQFPathwayResponse(BaseModel):
    id: int
    occupation: str
    role: str
    nsqf_level: Optional[int] = None
    required_skills: List[str]
    skill_gaps: List[str]
    training_pathway: Dict[str, Any]
    training_duration_months: Optional[int] = None
    training_availability: Optional[str] = None
    source_label: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Recommendation Schemas
class RecommendationRequest(BaseModel):
    beneficiary_id: int

class ScoreBreakdown(BaseModel):
    skill_fit: float
    aspiration_match: float
    distance_score: float
    employment_type_score: float
    training_accessibility_score: float

class RecommendationResponse(BaseModel):
    id: int
    beneficiary_id: int
    opportunity_id: Optional[int] = None
    nsqf_pathway_id: Optional[int] = None
    decision: str
    overall_score: Optional[float] = None
    opportunity_confidence: Optional[float] = None
    skill_fit: Optional[float] = None
    aspiration_match: Optional[float] = None
    distance_score: Optional[float] = None
    employment_type_score: Optional[float] = None
    training_accessibility_score: Optional[float] = None
    coverage_status: Optional[str] = None
    matched_skills: Optional[List[str]] = []
    skill_gaps: Optional[List[str]] = []
    explanation: Optional[str] = None
    counsellor_status: Optional[str] = "PENDING"
    counsellor_notes: Optional[str] = None
    reviewed_by: Optional[str] = None
    reviewed_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    # Related data
    beneficiary: Optional[BeneficiaryResponse] = None
    opportunity: Optional[OpportunityResponse] = None
    nsqf_pathway: Optional[NSQFPathwayResponse] = None

    class Config:
        from_attributes = True

# Counsellor Review Schemas
class CounsellorReviewRequest(BaseModel):
    recommendation_id: int
    status: str  # COUNSELLOR_VERIFIED, MORE_EVIDENCE_REQUIRED, REJECTED
    notes: Optional[str] = None
    reviewer: str

class CounsellorReviewResponse(BaseModel):
    recommendation_id: int
    status: str
    notes: Optional[str] = None
    reviewer: str
    reviewed_at: datetime

# Audit Log Schemas
class AuditLogResponse(BaseModel):
    id: int
    entity_type: str
    entity_id: int
    action: str
    actor: Optional[str] = None
    changes: Optional[Dict[str, Any]] = None
    metadata: Optional[Dict[str, Any]] = None
    created_at: datetime

    class Config:
        from_attributes = True

# Sync Schemas
class SyncRequest(BaseModel):
    entity_type: str
    data: Dict[str, Any]
    client_timestamp: datetime

class SyncResponse(BaseModel):
    success: bool
    entity_id: Optional[int] = None
    message: str
