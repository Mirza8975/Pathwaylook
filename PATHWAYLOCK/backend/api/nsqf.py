"""
NSQF Pathways API endpoints
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional

from database.connection import get_db
from models.database import NSQFPathway
from schemas.schemas import NSQFPathwayResponse

router = APIRouter()

@router.get("/nsqf/pathways", response_model=List[NSQFPathwayResponse])
async def list_pathways(
    occupation: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """List NSQF pathways with optional occupation filter"""
    query = db.query(NSQFPathway)

    if occupation:
        query = query.filter(NSQFPathway.occupation.ilike(f"%{occupation}%"))

    pathways = query.all()
    return pathways

@router.get("/nsqf/pathways/{pathway_id}", response_model=NSQFPathwayResponse)
async def get_pathway(
    pathway_id: int,
    db: Session = Depends(get_db)
):
    """Get NSQF pathway by ID"""
    pathway = db.query(NSQFPathway).filter(NSQFPathway.id == pathway_id).first()
    if not pathway:
        raise HTTPException(status_code=404, detail="Pathway not found")
    return pathway
