from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.schemas.vehicle import VehicleCreate
from app.core.dependencies import require_roles
from app.database.database import get_db
from app.models.vehicle import Vehicle
from app.models.vehicle_type import VehicleType


router = APIRouter(prefix="/vehicles", tags=["Vehicles"])


def get_vehicle_type(
    vehicle_type_name: str,
    db: Session
):
    vehicle_type = (
        db.query(VehicleType)
        .filter(VehicleType.name == vehicle_type_name)
        .first()
    )

    if vehicle_type is None:
        raise HTTPException(
            status_code=400,
            detail=f"Vehicle type '{vehicle_type_name}' not found"
        )

    return vehicle_type


@router.post("/")
def create_vehicle(
    vehicle: VehicleCreate,
    db: Session = Depends(get_db),
    user=Depends(require_roles("ADMIN", "FLEET_MANAGER"))
):
    vehicle_type = get_vehicle_type(
        vehicle.vehicle_type,
        db
    )

    existing = (
        db.query(Vehicle)
        .filter(
            Vehicle.registration_number
            == vehicle.registration_number
        )
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Vehicle registration number already exists"
        )

    new_vehicle = Vehicle(
        registration_number=vehicle.registration_number,
        model=vehicle.model,
        vehicle_type_id=vehicle_type.id,
        status=vehicle.status,
    )

    db.add(new_vehicle)
    db.commit()
    db.refresh(new_vehicle)

    return new_vehicle


@router.get("/")
def get_vehicles(
    db: Session = Depends(get_db),
    user=Depends(require_roles("ADMIN", "FLEET_MANAGER"))
):
    return db.query(Vehicle).all()


@router.delete("/{vehicle_id}")
def delete_vehicle(
    vehicle_id: int,
    db: Session = Depends(get_db),
    user=Depends(require_roles("ADMIN", "FLEET_MANAGER"))
):
    vehicle = (
        db.query(Vehicle)
        .filter(Vehicle.id == vehicle_id)
        .first()
    )

    if vehicle is None:
        raise HTTPException(
            status_code=404,
            detail="Vehicle not found"
        )

    db.delete(vehicle)
    db.commit()

    return {
        "message": "Vehicle deleted successfully"
    }


@router.put("/{vehicle_id}")
def update_vehicle(
    vehicle_id: int,
    updated_vehicle: VehicleCreate,
    db: Session = Depends(get_db),
    user=Depends(require_roles("ADMIN", "FLEET_MANAGER"))
):
    vehicle = (
        db.query(Vehicle)
        .filter(Vehicle.id == vehicle_id)
        .first()
    )

    if vehicle is None:
        raise HTTPException(
            status_code=404,
            detail="Vehicle not found"
        )

    vehicle_type = get_vehicle_type(
        updated_vehicle.vehicle_type,
        db
    )

    vehicle.registration_number = (
        updated_vehicle.registration_number
    )

    vehicle.model = updated_vehicle.model

    vehicle.vehicle_type_id = vehicle_type.id

    vehicle.status = updated_vehicle.status

    db.commit()
    db.refresh(vehicle)

    return vehicle