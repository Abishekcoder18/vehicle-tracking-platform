from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime

from app.database.database import Base


class Vehicle(Base):
    __tablename__ = "vehicles"

    id = Column(Integer, primary_key=True, index=True)

    registration_number = Column(
        String,
        unique=True,
        nullable=False
    )

    model = Column(String, nullable=False)

    vehicle_type_id = Column(
        Integer,
        ForeignKey("vehicle_types.id"),
        nullable=False,
        index=True
    )

    status = Column(
        String,
        default="Available",
        nullable=True
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False
    )

    vehicle_type = relationship(
        "VehicleType",
        back_populates="vehicles"
    )

    trips = relationship(
        "Trip",
        back_populates="vehicle"
    )

    locations = relationship(
        "VehicleLocation",
        back_populates="vehicle"
    )