"""
Recommendations API endpoints
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from database.connection import get_db
from models.database import Recommendation, Beneficiary, Opportunity, Coverage, NSQFPathway, AuditLog
from schemas.schemas import RecommendationRequest, RecommendationResponse
from rules.engine import PathwayLockEngine
from datetime import datetime

router = APIRouter()

@router.post("/recommendations/generate", response_model=RecommendationResponse)
async def generate_recommendation(
    request: RecommendationRequest,
    db: Session = Depends(get_db)
):
    """Generate PathwayLock recommendation for a beneficiary"""

    # Get beneficiary
    beneficiary = db.query(Beneficiary).filter(Beneficiary.id == request.beneficiary_id).first()
    if not beneficiary:
        raise HTTPException(status_code=404, detail="Beneficiary not found")

    # Find matching opportunities based on aspiration
    aspiration = beneficiary.aspiration
    if not aspiration:
        raise HTTPException(status_code=400, detail="Beneficiary aspiration is required")

    # Get coverage status
    coverage = db.query(Coverage).filter(Coverage.occupation.ilike(f"%{aspiration}%")).first()
    coverage_status = coverage.status if coverage else "NEVER_SEARCHED"

    # If coverage is NEVER_SEARCHED, return RED immediately
    if coverage_status == "NEVER_SEARCHED":
        decision, explanation = PathwayLockEngine.make_decision(
            overall_score=0.0,
            opportunity_confidence=0.0,
            coverage_status=coverage_status,
            counsellor_verified=False,
            training_pathway_exists=False
        )

        recommendation = Recommendation(
            beneficiary_id=beneficiary.id,
            opportunity_id=None,
            nsqf_pathway_id=None,
            decision=decision,
            overall_score=0.0,
            opportunity_confidence=0.0,
            skill_fit=0.0,
            aspiration_match=0.0,
            distance_score=0.0,
            employment_type_score=0.0,
            training_accessibility_score=0.0,
            coverage_status=coverage_status,
            matched_skills=[],
            skill_gaps=[],
            explanation=explanation,
            counsellor_status="PENDING"
        )

        db.add(recommendation)
        db.commit()
        db.refresh(recommendation)

        # Load relationships
        recommendation.beneficiary = beneficiary

        return recommendation

    # Find opportunities matching aspiration and within mobility radius
    opportunities = db.query(Opportunity).filter(
        Opportunity.occupation.ilike(f"%{aspiration}%")
    ).all()

    if not opportunities:
        # No opportunities found even though coverage shows SEARCHED_FOUND
        decision = "RED"
        explanation = "No opportunities found matching the aspiration."

        recommendation = Recommendation(
            beneficiary_id=beneficiary.id,
            opportunity_id=None,
            nsqf_pathway_id=None,
            decision=decision,
            overall_score=0.0,
            opportunity_confidence=0.0,
            coverage_status=coverage_status,
            matched_skills=[],
            skill_gaps=[],
            explanation=explanation,
            counsellor_status="PENDING"
        )

        db.add(recommendation)
        db.commit()
        db.refresh(recommendation)
        recommendation.beneficiary = beneficiary

        return recommendation

    # Evaluate each opportunity
    best_opportunity = None
    best_score = -1
    best_scores = None

    for opportunity in opportunities:
        # Check hard constraints first

        # Distance constraint
        if beneficiary.mobility_radius_km:
            if opportunity.distance_km and opportunity.distance_km > beneficiary.mobility_radius_km:
                continue  # Skip this opportunity

        # Calculate scores
        skill_fit, matched_skills = PathwayLockEngine.calculate_skill_fit(
            beneficiary.skills or [],
            opportunity.required_skills or []
        )

        aspiration_match = PathwayLockEngine.calculate_aspiration_match(
            beneficiary.aspiration,
            opportunity.occupation
        )

        distance_score = PathwayLockEngine.calculate_distance_score(
            opportunity.distance_km or 0,
            beneficiary.mobility_radius_km
        )

        # Skip if distance score is 0 (hard constraint violated)
        if distance_score == 0:
            continue

        employment_type_score = PathwayLockEngine.calculate_employment_type_score(
            opportunity.employment_type or "full-time",
            beneficiary.work_preference
        )

        # Find NSQF pathway
        nsqf_pathway = db.query(NSQFPathway).filter(
            NSQFPathway.occupation.ilike(f"%{opportunity.occupation}%")
        ).first()

        training_accessibility = PathwayLockEngine.calculate_training_accessibility(
            nsqf_pathway.training_availability if nsqf_pathway else None
        )

        # Calculate overall score
        overall_score = PathwayLockEngine.calculate_overall_score(
            skill_fit,
            aspiration_match,
            distance_score,
            employment_type_score,
            training_accessibility
        )

        # Keep track of best opportunity
        if overall_score > best_score:
            best_score = overall_score
            best_opportunity = opportunity
            best_scores = {
                "skill_fit": skill_fit,
                "aspiration_match": aspiration_match,
                "distance_score": distance_score,
                "employment_type_score": employment_type_score,
                "training_accessibility": training_accessibility,
                "matched_skills": matched_skills
            }

    # If no opportunity passed hard constraints
    if not best_opportunity:
        decision = "RED"
        explanation = "No opportunities satisfy the mobility or employment constraints."

        recommendation = Recommendation(
            beneficiary_id=beneficiary.id,
            opportunity_id=None,
            nsqf_pathway_id=None,
            decision=decision,
            overall_score=0.0,
            opportunity_confidence=0.0,
            coverage_status=coverage_status,
            matched_skills=[],
            skill_gaps=[],
            explanation=explanation,
            counsellor_status="PENDING"
        )

        db.add(recommendation)
        db.commit()
        db.refresh(recommendation)
        recommendation.beneficiary = beneficiary

        return recommendation

    # Calculate opportunity confidence
    opportunity_confidence = PathwayLockEngine.calculate_opportunity_confidence(
        best_opportunity.source_type or "SAMPLE_DATA",
        best_opportunity.verification_status or "UNVERIFIED",
        best_opportunity.last_verified_at
    )

    # Find NSQF pathway
    nsqf_pathway = db.query(NSQFPathway).filter(
        NSQFPathway.occupation.ilike(f"%{best_opportunity.occupation}%")
    ).first()

    training_pathway_exists = nsqf_pathway is not None

    # Identify skill gaps
    skill_gaps = PathwayLockEngine.identify_skill_gaps(
        best_opportunity.required_skills or [],
        best_scores["matched_skills"]
    )

    # Check if counsellor verified
    counsellor_verified = best_opportunity.verification_status == "COUNSELLOR_VERIFIED"

    # Make final decision
    decision, explanation = PathwayLockEngine.make_decision(
        overall_score=best_score,
        opportunity_confidence=opportunity_confidence,
        coverage_status=coverage_status,
        counsellor_verified=counsellor_verified,
        training_pathway_exists=training_pathway_exists
    )

    # Create recommendation
    recommendation = Recommendation(
        beneficiary_id=beneficiary.id,
        opportunity_id=best_opportunity.id,
        nsqf_pathway_id=nsqf_pathway.id if nsqf_pathway else None,
        decision=decision,
        overall_score=best_score,
        opportunity_confidence=opportunity_confidence,
        skill_fit=best_scores["skill_fit"],
        aspiration_match=best_scores["aspiration_match"],
        distance_score=best_scores["distance_score"],
        employment_type_score=best_scores["employment_type_score"],
        training_accessibility_score=best_scores["training_accessibility"],
        coverage_status=coverage_status,
        matched_skills=best_scores["matched_skills"],
        skill_gaps=skill_gaps,
        explanation=explanation,
        counsellor_status="PENDING"
    )

    db.add(recommendation)
    db.commit()
    db.refresh(recommendation)

    # Create audit log
    audit = AuditLog(
        entity_type="recommendation",
        entity_id=recommendation.id,
        action="created",
        actor="system",
        metadata={
            "decision": decision,
            "overall_score": best_score,
            "opportunity_confidence": opportunity_confidence
        }
    )
    db.add(audit)
    db.commit()

    # Load relationships for response
    recommendation.beneficiary = beneficiary
    recommendation.opportunity = best_opportunity
    recommendation.nsqf_pathway = nsqf_pathway

    return recommendation

@router.get("/recommendations/{recommendation_id}", response_model=RecommendationResponse)
async def get_recommendation(
    recommendation_id: int,
    db: Session = Depends(get_db)
):
    """Get recommendation by ID"""
    recommendation = db.query(Recommendation).filter(Recommendation.id == recommendation_id).first()
    if not recommendation:
        raise HTTPException(status_code=404, detail="Recommendation not found")

    # Load relationships
    recommendation.beneficiary = db.query(Beneficiary).filter(Beneficiary.id == recommendation.beneficiary_id).first()
    if recommendation.opportunity_id:
        recommendation.opportunity = db.query(Opportunity).filter(Opportunity.id == recommendation.opportunity_id).first()
    if recommendation.nsqf_pathway_id:
        recommendation.nsqf_pathway = db.query(NSQFPathway).filter(NSQFPathway.id == recommendation.nsqf_pathway_id).first()

    return recommendation

@router.get("/recommendations", response_model=List[RecommendationResponse])
async def list_recommendations(
    beneficiary_id: int = None,
    decision: str = None,
    counsellor_status: str = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """List recommendations with optional filters"""
    query = db.query(Recommendation)

    if beneficiary_id:
        query = query.filter(Recommendation.beneficiary_id == beneficiary_id)

    if decision:
        query = query.filter(Recommendation.decision == decision)

    if counsellor_status:
        query = query.filter(Recommendation.counsellor_status == counsellor_status)

    recommendations = query.order_by(Recommendation.created_at.desc()).offset(skip).limit(limit).all()

    # Load relationships for each recommendation
    for rec in recommendations:
        rec.beneficiary = db.query(Beneficiary).filter(Beneficiary.id == rec.beneficiary_id).first()
        if rec.opportunity_id:
            rec.opportunity = db.query(Opportunity).filter(Opportunity.id == rec.opportunity_id).first()
        if rec.nsqf_pathway_id:
            rec.nsqf_pathway = db.query(NSQFPathway).filter(NSQFPathway.id == rec.nsqf_pathway_id).first()

    return recommendations
