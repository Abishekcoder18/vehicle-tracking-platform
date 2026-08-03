from sqlalchemy import Column, Integer, String
from app.database.database import Base


class Vehicle(Base):
    __tablename__ = "vehicles"

    id = Column(Integer, primary_key=True, index=True)
    registration_number = Column(String, unique=True, nullable=False)
    model = Column(String, nullable=False)
    vehicle_type = Column(String, nullable=False)
    status = Column(String, default="Available")