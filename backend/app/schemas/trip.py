from datetime import datetime
from pydantic import BaseModel


class TripCreate(BaseModel):
    source: str
    destination: str
    driver_id: int
    vehicle_id: int
    status: str = "Pending"


class DriverSummary(BaseModel):
    id: int
    name: str
    phone: str
    license_number: str
    status: str

    class Config:
        from_attributes = True


class VehicleSummary(BaseModel):
    id: int
    registration_number: str
    model: str
    status: str

    class Config:
        from_attributes = True


class TripResponse(BaseModel):
    id: int
    source: str
    destination: str
    status: str
    driver_id: int
    vehicle_id: int
    created_at: datetime
    driver: DriverSummary
    vehicle: VehicleSummary

    class Config:
        from_attributes = True
