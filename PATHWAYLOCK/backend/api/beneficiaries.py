"""
Beneficiaries API endpoints
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from database.connection import get_db
from models.database import Beneficiary, AuditLog
from schemas.schemas import BeneficiaryCreate, BeneficiaryResponse
from datetime import datetime

router = APIRouter()

@router.post("/beneficiaries", response_model=BeneficiaryResponse)
async def create_beneficiary(
    beneficiary: BeneficiaryCreate,
    db: Session = Depends(get_db)
):
    """Create a new beneficiary profile"""
    db_beneficiary = Beneficiary(**beneficiary.model_dump())
    db.add(db_beneficiary)
    db.commit()
    db.refresh(db_beneficiary)

    # Create audit log
    audit = AuditLog(
        entity_type="beneficiary",
        entity_id=db_beneficiary.id,
        action="created",
        actor="system",
        metadata={"source": "web_form"}
    )
    db.add(audit)
    db.commit()

    return db_beneficiary

@router.get("/beneficiaries/{beneficiary_id}", response_model=BeneficiaryResponse)
async def get_beneficiary(
    beneficiary_id: int,
    db: Session = Depends(get_db)
):
    """Get beneficiary by ID"""
    beneficiary = db.query(Beneficiary).filter(Beneficiary.id == beneficiary_id).first()
    if not beneficiary:
        raise HTTPException(status_code=404, detail="Beneficiary not found")
    return beneficiary

@router.get("/beneficiaries", response_model=List[BeneficiaryResponse])
async def list_beneficiaries(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """List all beneficiaries"""
    beneficiaries = db.query(Beneficiary).offset(skip).limit(limit).all()
    return beneficiaries
