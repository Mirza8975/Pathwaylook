"""
Counsellor review API endpoints
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from database.connection import get_db
from models.database import Recommendation, AuditLog, Beneficiary, Opportunity, NSQFPathway
from schemas.schemas import CounsellorReviewRequest, CounsellorReviewResponse, RecommendationResponse
from datetime import datetime

router = APIRouter()

@router.post("/counsellor/review", response_model=CounsellorReviewResponse)
async def submit_review(
    review: CounsellorReviewRequest,
    db: Session = Depends(get_db)
):
    """Submit counsellor review for a recommendation"""

    # Get recommendation
    recommendation = db.query(Recommendation).filter(
        Recommendation.id == review.recommendation_id
    ).first()

    if not recommendation:
        raise HTTPException(status_code=404, detail="Recommendation not found")

    # Update recommendation
    old_status = recommendation.counsellor_status
    recommendation.counsellor_status = review.status
    recommendation.counsellor_notes = review.notes
    recommendation.reviewed_by = review.reviewer
    recommendation.reviewed_at = datetime.utcnow()

    db.commit()

    # Create audit log
    audit = AuditLog(
        entity_type="counsellor_review",
        entity_id=recommendation.id,
        action="reviewed",
        actor=review.reviewer,
        changes={
            "old_status": old_status,
            "new_status": review.status
        },
        metadata={
            "notes": review.notes
        }
    )
    db.add(audit)
    db.commit()

    return CounsellorReviewResponse(
        recommendation_id=recommendation.id,
        status=recommendation.counsellor_status,
        notes=recommendation.counsellor_notes,
        reviewer=recommendation.reviewed_by,
        reviewed_at=recommendation.reviewed_at
    )

@router.get("/counsellor/pending", response_model=List[RecommendationResponse])
async def get_pending_reviews(
    db: Session = Depends(get_db)
):
    """Get all recommendations pending counsellor review"""
    recommendations = db.query(Recommendation).filter(
        Recommendation.counsellor_status == "PENDING"
    ).order_by(Recommendation.created_at.desc()).all()

    # Load relationships
    for rec in recommendations:
        rec.beneficiary = db.query(Beneficiary).filter(Beneficiary.id == rec.beneficiary_id).first()
        if rec.opportunity_id:
            rec.opportunity = db.query(Opportunity).filter(Opportunity.id == rec.opportunity_id).first()
        if rec.nsqf_pathway_id:
            rec.nsqf_pathway = db.query(NSQFPathway).filter(NSQFPathway.id == rec.nsqf_pathway_id).first()

    return recommendations

@router.get("/counsellor/reviewed", response_model=List[RecommendationResponse])
async def get_reviewed(
    status: str = None,
    db: Session = Depends(get_db)
):
    """Get reviewed recommendations"""
    query = db.query(Recommendation).filter(
        Recommendation.counsellor_status != "PENDING"
    )

    if status:
        query = query.filter(Recommendation.counsellor_status == status)

    recommendations = query.order_by(Recommendation.reviewed_at.desc()).all()

    # Load relationships
    for rec in recommendations:
        rec.beneficiary = db.query(Beneficiary).filter(Beneficiary.id == rec.beneficiary_id).first()
        if rec.opportunity_id:
            rec.opportunity = db.query(Opportunity).filter(Opportunity.id == rec.opportunity_id).first()
        if rec.nsqf_pathway_id:
            rec.nsqf_pathway = db.query(NSQFPathway).filter(NSQFPathway.id == rec.nsqf_pathway_id).first()

    return recommendations

@router.get("/audit/{entity_id}")
async def get_audit_trail(
    entity_id: int,
    entity_type: str = "recommendation",
    db: Session = Depends(get_db)
):
    """Get audit trail for an entity"""
    audits = db.query(AuditLog).filter(
        AuditLog.entity_type == entity_type,
        AuditLog.entity_id == entity_id
    ).order_by(AuditLog.created_at.asc()).all()

    return audits
