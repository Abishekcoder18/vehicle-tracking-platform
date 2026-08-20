from pydantic import BaseModel


class DriverCreate(BaseModel):
    name: str
    phone: str
    license_number: str
    user_id: int
    status: str = "Available"


class DriverResponse(BaseModel):
    id: int
    name: str
    phone: str
    license_number: str
    user_id: int
    status: str

    class Config:
        from_attributes = True
