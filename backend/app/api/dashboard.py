from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.vehicle import Vehicle
from app.models.trip import Trip

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/")
def dashboard(db: Session = Depends(get_db)):

    total_vehicles = db.query(Vehicle).count()

    available_vehicles = db.query(Vehicle).filter(
        Vehicle.status == "Available"
    ).count()

    running_vehicles = db.query(Vehicle).filter(
        Vehicle.status == "On Trip"
    ).count()

    maintenance_vehicles = db.query(Vehicle).filter(
        Vehicle.status == "Maintenance"
    ).count()

    total_trips = db.query(Trip).count()

    pending_trips = db.query(Trip).filter(
        Trip.status == "Pending"
    ).count()

    running_trips = db.query(Trip).filter(
        Trip.status == "Active"
    ).count()

    completed_trips = db.query(Trip).filter(
        Trip.status == "Completed"
    ).count()

    # Active trips for Logistics Operator tracking
    active_trip_records = db.query(Trip).filter(
        Trip.status == "Active"
    ).all()

    active_trips = []

    for trip in active_trip_records:

        active_trips.append({
            "id": trip.id,
            "status": trip.status,
            "source": trip.source,
            "destination": trip.destination,
            "vehicle_id": trip.vehicle_id,
            "driver_id": trip.driver_id,
            "vehicle_number": (
                trip.vehicle.registration_number
                if trip.vehicle
                else None
            ),
            "driver_name": (
                trip.driver.name
                if trip.driver
                else None
            ),
        })

    return {
        "total_vehicles": total_vehicles,
        "available_vehicles": available_vehicles,
        "running_vehicles": running_vehicles,
        "maintenance_vehicles": maintenance_vehicles,
        "total_trips": total_trips,
        "pending_trips": pending_trips,
        "running_trips": running_trips,
        "completed_trips": completed_trips,

        # Operator tracking data
        "active_trips": active_trips,
    }