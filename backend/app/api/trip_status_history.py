from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.dependencies import verify_token
from app.database.database import get_db
from app.models.trip_status_history import TripStatusHistory
from app.models.trip import Trip
from app.schemas.trip_status_history import TripStatusHistoryResponse


router = APIRouter(
    prefix="/trip-status-history",
    tags=["Trip Status History"]
)


@router.get(
    "/trip/{trip_id}",
    response_model=list[TripStatusHistoryResponse]
)
def get_trip_status_history(
    trip_id: int,
    db: Session = Depends(get_db),
    user=Depends(verify_token)
):
    trip = (
        db.query(Trip)
        .filter(Trip.id == trip_id)
        .first()
    )

    if trip is None:
        raise HTTPException(
            status_code=404,
            detail="Trip not found"
        )

    return (
        db.query(TripStatusHistory)
        .filter(TripStatusHistory.trip_id == trip_id)
        .order_by(TripStatusHistory.changed_at.asc())
        .all()
    )
