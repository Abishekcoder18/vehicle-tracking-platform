from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.vehicle import Vehicle
from app.models.trip import Trip

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/")
def dashboard(db: Session = Depends(get_db)):
    total_vehicles = db.query(Vehicle).count()
    total_trips = db.query(Trip).count()

    return {
        "total_vehicles": total_vehicles,
        "total_trips": total_trips,
    }