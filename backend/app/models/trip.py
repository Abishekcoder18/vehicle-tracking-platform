from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime

from app.database.database import Base


class Trip(Base):
    __tablename__ = "trips"

    id = Column(Integer, primary_key=True, index=True)

    source = Column(String, nullable=False)

    destination = Column(String, nullable=False)

    status = Column(
        String,
        default="Pending",
        nullable=True
    )

    driver_id = Column(
        Integer,
        ForeignKey("drivers.id"),
        nullable=False,
        index=True
    )

    vehicle_id = Column(
        Integer,
        ForeignKey("vehicles.id"),
        nullable=False,
        index=True
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False
    )

    driver = relationship(
        "Driver",
        back_populates="trips"
    )

    vehicle = relationship(
        "Vehicle",
        back_populates="trips"
    )

    locations = relationship(
        "VehicleLocation",
        back_populates="trip"
    )

    status_history = relationship(
        "TripStatusHistory",
        back_populates="trip"
    )

    route_history = relationship(
        "RouteHistory",
        back_populates="trip"
    )

    notifications = relationship(
        "Notification",
        back_populates="trip"
    )

    incidents = relationship(
        "Incident",
        back_populates="trip"
    )