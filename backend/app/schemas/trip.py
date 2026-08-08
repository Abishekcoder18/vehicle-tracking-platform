from pydantic import BaseModel


class TripCreate(BaseModel):
    source: str
    destination: str
    driver_name: str
    vehicle_number: str
    status: str = "Pending"


class TripResponse(BaseModel):
    id: int
    source: str
    destination: str
    driver_name: str
    vehicle_number: str
    status: str

    class Config:
        from_attributes = True