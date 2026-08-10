from datetime import datetime

from pydantic import BaseModel


class VehicleLocationCreate(BaseModel):
    vehicle_id: int
    trip_id: int
    latitude: float
    longitude: float


class VehicleLocationResponse(BaseModel):
    id: int
    vehicle_id: int
    trip_id: int
    latitude: float
    longitude: float
    timestamp: datetime

    class Config:
        from_attributes = True