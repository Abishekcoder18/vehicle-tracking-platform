from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.dependencies import verify_token
from app.database.database import get_db
from app.models.trip import Trip
from app.schemas.trip import TripCreate

router = APIRouter(prefix="/trips", tags=["Trips"])


@router.post("/")
def create_trip(
    trip: TripCreate,
    db: Session = Depends(get_db),
    user=Depends(verify_token)
):
    new_trip = Trip(
        source=trip.source,
        destination=trip.destination,
        driver_name=trip.driver_name,
        vehicle_number=trip.vehicle_number,
    )

    db.add(new_trip)
    db.commit()
    db.refresh(new_trip)

    return new_trip


@router.get("/")
def get_trips(
    db: Session = Depends(get_db),
    user=Depends(verify_token)
):
    return db.query(Trip).all()


@router.delete("/{trip_id}")
def delete_trip(
    trip_id: int,
    db: Session = Depends(get_db),
    user=Depends(verify_token)
):
    trip = db.query(Trip).filter(Trip.id == trip_id).first()

    if trip is None:
        raise HTTPException(status_code=404, detail="Trip not found")

    db.delete(trip)
    db.commit()

    return {"message": "Trip deleted successfully"}