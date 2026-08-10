from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.dependencies import verify_token
from app.database.database import get_db
from app.models.driver import Driver
from app.schemas.driver import DriverCreate, DriverResponse


router = APIRouter(
    prefix="/drivers",
    tags=["Drivers"]
)


# ==========================================
# CREATE DRIVER
# ==========================================

@router.post("/", response_model=DriverResponse)
def create_driver(
    driver: DriverCreate,
    db: Session = Depends(get_db),
    user=Depends(verify_token)
):
    existing_driver = (
        db.query(Driver)
        .filter(Driver.license_number == driver.license_number)
        .first()
    )

    if existing_driver:
        raise HTTPException(
            status_code=400,
            detail="License number already exists"
        )

    new_driver = Driver(
        name=driver.name,
        phone=driver.phone,
        license_number=driver.license_number,
        status=driver.status
    )

    db.add(new_driver)
    db.commit()
    db.refresh(new_driver)

    return new_driver


# ==========================================
# GET ALL DRIVERS
# ==========================================

@router.get("/", response_model=list[DriverResponse])
def get_drivers(
    db: Session = Depends(get_db),
    user=Depends(verify_token)
):
    return db.query(Driver).all()


# ==========================================
# UPDATE DRIVER
# ==========================================

@router.put("/{driver_id}", response_model=DriverResponse)
def update_driver(
    driver_id: int,
    updated_driver: DriverCreate,
    db: Session = Depends(get_db),
    user=Depends(verify_token)
):
    driver = (
        db.query(Driver)
        .filter(Driver.id == driver_id)
        .first()
    )

    if driver is None:
        raise HTTPException(
            status_code=404,
            detail="Driver not found"
        )

    driver.name = updated_driver.name
    driver.phone = updated_driver.phone
    driver.license_number = updated_driver.license_number
    driver.status = updated_driver.status

    db.commit()
    db.refresh(driver)

    return driver


# ==========================================
# DELETE DRIVER
# ==========================================

@router.delete("/{driver_id}")
def delete_driver(
    driver_id: int,
    db: Session = Depends(get_db),
    user=Depends(verify_token)
):
    driver = (
        db.query(Driver)
        .filter(Driver.id == driver_id)
        .first()
    )

    if driver is None:
        raise HTTPException(
            status_code=404,
            detail="Driver not found"
        )

    db.delete(driver)
    db.commit()

    return {
        "message": "Driver deleted successfully"
    }