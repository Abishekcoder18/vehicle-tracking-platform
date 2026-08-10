from pydantic import BaseModel


class DriverCreate(BaseModel):
    name: str
    phone: str
    license_number: str
    status: str = "Available"


class DriverResponse(BaseModel):
    id: int
    name: str
    phone: str
    license_number: str
    status: str

    class Config:
        from_attributes = True