"""
Database models for PathwayLock
"""
from sqlalchemy import Column, Integer, String, Float, DateTime, Text, JSON, Boolean, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime

Base = declarative_base()

class Beneficiary(Base):
    __tablename__ = "beneficiaries"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    age = Column(Integer)
    education = Column(String)
    location = Column(String)
    current_livelihood = Column(String)
    skills = Column(JSON)  # List of skills
    traditional_skills = Column(JSON)  # List of traditional/family skills
    aspiration = Column(String)
    mobility_radius_km = Column(Float)
    work_preference = Column(String)  # full-time, part-time, flexible
    constraints = Column(JSON)  # List of constraints
    training_history = Column(JSON)  # List of previous trainings
    voice_transcript = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    recommendations = relationship("Recommendation", back_populates="beneficiary")

class Opportunity(Base):
    __tablename__ = "opportunities"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    occupation = Column(String, nullable=False)
    location = Column(String, nullable=False)
    distance_km = Column(Float)
    employment_type = Column(String)  # full-time, part-time, flexible, self-employment
    required_skills = Column(JSON)  # List of required skills
    qualification = Column(String)
    source = Column(String)  # Name of the source
    source_type = Column(String)  # FIELD_VERIFIED, PUBLIC_SOURCE, SAMPLE_DATA, SYNTHETIC
    last_verified_at = Column(DateTime)
    verification_status = Column(String)  # COUNSELLOR_VERIFIED, UNVERIFIED
    confidence = Column(Float)  # 0.0 to 1.0
    description = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Coverage(Base):
    __tablename__ = "coverage"

    id = Column(Integer, primary_key=True, index=True)
    occupation = Column(String, nullable=False, unique=True)
    location = Column(String)
    status = Column(String, nullable=False)  # SEARCHED_FOUND, SEARCHED_NONE, NEVER_SEARCHED
    last_searched_at = Column(DateTime)
    opportunities_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class NSQFPathway(Base):
    __tablename__ = "nsqf_pathways"

    id = Column(Integer, primary_key=True, index=True)
    occupation = Column(String, nullable=False)
    role = Column(String, nullable=False)
    nsqf_level = Column(Integer)
    required_skills = Column(JSON)  # List of required skills
    skill_gaps = Column(JSON)  # List of common skill gaps
    training_pathway = Column(JSON)  # Training course details
    training_duration_months = Column(Integer)
    training_availability = Column(String)  # Available, Limited, Not Available
    source_label = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Recommendation(Base):
    __tablename__ = "recommendations"

    id = Column(Integer, primary_key=True, index=True)
    beneficiary_id = Column(Integer, ForeignKey("beneficiaries.id"))
    opportunity_id = Column(Integer, ForeignKey("opportunities.id"))
    nsqf_pathway_id = Column(Integer, ForeignKey("nsqf_pathways.id"))

    # Decision
    decision = Column(String, nullable=False)  # GREEN, YELLOW, RED, RED_UNCOVERED, RED_NO_TRAINING_PATHWAY
    overall_score = Column(Float)
    opportunity_confidence = Column(Float)

    # Score breakdown
    skill_fit = Column(Float)
    aspiration_match = Column(Float)
    distance_score = Column(Float)
    employment_type_score = Column(Float)
    training_accessibility_score = Column(Float)

    # Metadata
    coverage_status = Column(String)
    matched_skills = Column(JSON)
    skill_gaps = Column(JSON)
    explanation = Column(Text)

    # Counsellor review
    counsellor_status = Column(String)  # PENDING, COUNSELLOR_VERIFIED, MORE_EVIDENCE_REQUIRED, REJECTED
    counsellor_notes = Column(Text)
    reviewed_by = Column(String)
    reviewed_at = Column(DateTime)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    beneficiary = relationship("Beneficiary", back_populates="recommendations")

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    entity_type = Column(String, nullable=False)  # beneficiary, recommendation, counsellor_review
    entity_id = Column(Integer, nullable=False)
    action = Column(String, nullable=False)  # created, updated, approved, rejected
    actor = Column(String)  # user or system identifier
    changes = Column(JSON)  # Details of what changed
    metadata = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)
