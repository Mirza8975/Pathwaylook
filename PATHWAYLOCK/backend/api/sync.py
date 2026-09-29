"""
Sync API for offline support
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database.connection import get_db
from schemas.schemas import SyncRequest, SyncResponse
from models.database import Beneficiary, Recommendation

router = APIRouter()

@router.post("/sync", response_model=SyncResponse)
async def sync_data(
    sync_request: SyncRequest,
    db: Session = Depends(get_db)
):
    """
    Sync offline data to server
    Handles beneficiaries and recommendations created offline
    """

    entity_type = sync_request.entity_type
    data = sync_request.data

    try:
        if entity_type == "beneficiary":
            # Create beneficiary from synced data
            beneficiary = Beneficiary(**data)
            db.add(beneficiary)
            db.commit()
            db.refresh(beneficiary)

            return SyncResponse(
                success=True,
                entity_id=beneficiary.id,
                message="Beneficiary synced successfully"
            )

        elif entity_type == "recommendation":
            # Note: Recommendations are typically generated server-side
            # This is for future offline generation capability
            recommendation = Recommendation(**data)
            db.add(recommendation)
            db.commit()
            db.refresh(recommendation)

            return SyncResponse(
                success=True,
                entity_id=recommendation.id,
                message="Recommendation synced successfully"
            )

        else:
            raise HTTPException(
                status_code=400,
                detail=f"Unknown entity type: {entity_type}"
            )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Sync failed: {str(e)}"
        )
