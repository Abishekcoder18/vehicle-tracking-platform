from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    role: str = "FLEET_MANAGER"


class UserLogin(BaseModel):
    email: EmailStr
    password: str