from datetime import datetime

from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    Numeric,
    DateTime,
    ForeignKey,
)
from sqlalchemy.orm import relationship

from app.database.database import Base


class Incident(Base):
    __tablename__ = "incidents"

    id = Column(Integer, primary_key=True, index=True)

    vehicle_id = Column(
        Integer,
        ForeignKey("vehicles.id"),
        nullable=False,
        index=True
    )

    trip_id = Column(
        Integer,
        ForeignKey("trips.id"),
        nullable=False,
        index=True
    )

    reported_by = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
        index=True
    )

    type = Column(String(50), nullable=False)

    description = Column(Text, nullable=False)

    status = Column(String(30), nullable=False)

    latitude = Column(Numeric(9, 6), nullable=True)
    longitude = Column(Numeric(9, 6), nullable=True)

    reported_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False
    )

    resolved_at = Column(DateTime, nullable=True)

    vehicle = relationship("Vehicle")
    trip = relationship(
        "Trip",
        back_populates="incidents"
    )
    reported_by_user = relationship(
        "User",
        foreign_keys=[reported_by]
    )