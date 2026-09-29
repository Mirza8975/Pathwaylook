"""
Opportunities API endpoints
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional

from database.connection import get_db
from models.database import Opportunity, Coverage
from schemas.schemas import OpportunityResponse, CoverageResponse

router = APIRouter()

@router.get("/opportunities", response_model=List[OpportunityResponse])
async def list_opportunities(
    occupation: Optional[str] = None,
    location: Optional[str] = None,
    max_distance: Optional[float] = None,
    db: Session = Depends(get_db)
):
    """List opportunities with optional filters"""
    query = db.query(Opportunity)

    if occupation:
        query = query.filter(Opportunity.occupation.ilike(f"%{occupation}%"))

    if location:
        query = query.filter(Opportunity.location.ilike(f"%{location}%"))

    if max_distance:
        query = query.filter(Opportunity.distance_km <= max_distance)

    opportunities = query.all()
    return opportunities

@router.get("/opportunities/{opportunity_id}", response_model=OpportunityResponse)
async def get_opportunity(
    opportunity_id: int,
    db: Session = Depends(get_db)
):
    """Get opportunity by ID"""
    opportunity = db.query(Opportunity).filter(Opportunity.id == opportunity_id).first()
    if not opportunity:
        raise HTTPException(status_code=404, detail="Opportunity not found")
    return opportunity

@router.get("/opportunities/coverage/{occupation}", response_model=CoverageResponse)
async def get_coverage(
    occupation: str,
    db: Session = Depends(get_db)
):
    """Get coverage status for an occupation"""
    coverage = db.query(Coverage).filter(Coverage.occupation == occupation).first()

    if not coverage:
        # Return NEVER_SEARCHED if not found
        return CoverageResponse(
            id=0,
            occupation=occupation,
            location=None,
            status="NEVER_SEARCHED",
            last_searched_at=None,
            opportunities_count=0,
            created_at=None,
            updated_at=None
        )

    return coverage
