from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas.vehicle import VehicleCreate
from app.core.dependencies import verify_token
from app.database.database import get_db
from app.models.vehicle import Vehicle

router = APIRouter(prefix="/vehicles", tags=["Vehicles"])


@router.post("/")
def create_vehicle(
    vehicle: VehicleCreate,
    db: Session = Depends(get_db),
    user=Depends(verify_token)
):
    new_vehicle = Vehicle(
        registration_number=vehicle.registration_number,
        model=vehicle.model,
        vehicle_type=vehicle.vehicle_type,
        status=vehicle.status,
    )

    db.add(new_vehicle)
    db.commit()
    db.refresh(new_vehicle)

    return new_vehicle


@router.get("/")
def get_vehicles(
    db: Session = Depends(get_db),
    user=Depends(verify_token)
):
    return db.query(Vehicle).all()


@router.delete("/{vehicle_id}")
def delete_vehicle(
    vehicle_id: int,
    db: Session = Depends(get_db),
    user=Depends(verify_token)
):
    vehicle = db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()

    if vehicle is None:
        raise HTTPException(status_code=404, detail="Vehicle not found")

    db.delete(vehicle)
    db.commit()

    return {"message": "Vehicle deleted successfully"}


@router.put("/{vehicle_id}")
def update_vehicle(
    vehicle_id: int,
    updated_vehicle: VehicleCreate,
    db: Session = Depends(get_db),
    user=Depends(verify_token)
):
    vehicle = db.query(Vehicle).filter(
        Vehicle.id == vehicle_id
    ).first()

    if vehicle is None:
        raise HTTPException(
            status_code=404,
            detail="Vehicle not found"
        )

    vehicle.registration_number = updated_vehicle.registration_number
    vehicle.model = updated_vehicle.model
    vehicle.vehicle_type = updated_vehicle.vehicle_type
    vehicle.status = updated_vehicle.status

    db.commit()
    db.refresh(vehicle)

    return vehicle