from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.dependencies import verify_token
from app.database.database import get_db
from app.models.vehicle_location import VehicleLocation
from app.schemas.vehicle_location import (
    VehicleLocationCreate,
    VehicleLocationResponse,
)


router = APIRouter(
    prefix="/vehicle-locations",
    tags=["Vehicle Locations"]
)


# ==========================================
# CREATE VEHICLE LOCATION
# ==========================================

@router.post(
    "/",
    response_model=VehicleLocationResponse
)
def create_vehicle_location(
    location: VehicleLocationCreate,
    db: Session = Depends(get_db),
    user=Depends(verify_token)
):
    new_location = VehicleLocation(
        vehicle_id=location.vehicle_id,
        trip_id=location.trip_id,
        latitude=location.latitude,
        longitude=location.longitude,
    )

    db.add(new_location)
    db.commit()
    db.refresh(new_location)

    return new_location


# ==========================================
# GET ALL VEHICLE LOCATIONS
# ==========================================

@router.get(
    "/",
    response_model=list[VehicleLocationResponse]
)
def get_vehicle_locations(
    db: Session = Depends(get_db),
    user=Depends(verify_token)
):
    return db.query(VehicleLocation).all()


# ==========================================
# GET LOCATIONS FOR ONE VEHICLE
# ==========================================

@router.get(
    "/vehicle/{vehicle_id}",
    response_model=list[VehicleLocationResponse]
)
def get_vehicle_locations_by_vehicle(
    vehicle_id: int,
    db: Session = Depends(get_db),
    user=Depends(verify_token)
):
    locations = (
        db.query(VehicleLocation)
        .filter(VehicleLocation.vehicle_id == vehicle_id)
        .order_by(VehicleLocation.timestamp.asc())
        .all()
    )

    return locations
# ==========================================
# GET LATEST LOCATION FOR ONE VEHICLE
# ==========================================

@router.get(
    "/vehicle/{vehicle_id}/latest",
    response_model=VehicleLocationResponse
)
def get_latest_vehicle_location(
    vehicle_id: int,
    db: Session = Depends(get_db),
    user=Depends(verify_token)
):
    location = (
        db.query(VehicleLocation)
        .filter(VehicleLocation.vehicle_id == vehicle_id)
        .order_by(VehicleLocation.timestamp.desc())
        .first()
    )

    if location is None:
        raise HTTPException(
            status_code=404,
            detail="No location data found for this vehicle"
        )

    return location
