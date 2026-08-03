from pydantic import BaseModel


class VehicleCreate(BaseModel):
    registration_number: str
    model: str
    vehicle_type: str


class VehicleResponse(BaseModel):
    id: int
    registration_number: str
    model: str
    vehicle_type: str
    status: str

    class Config:
        from_attributes = True