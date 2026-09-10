"""Pydantic schemas for user authentication."""


from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    """Schema for registering a new user."""

    username: str
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    """Schema for authenticating an existing user."""

    email: EmailStr
    password: str