from sqlalchemy import Column, Integer, Float, DateTime
from datetime import datetime

from app.database.database import Base


class VehicleLocation(Base):
    __tablename__ = "vehicle_locations"

    id = Column(Integer, primary_key=True, index=True)

    vehicle_id = Column(
        Integer,
        nullable=False,
        index=True
    )

    trip_id = Column(
        Integer,
        nullable=False,
        index=True
    )

    latitude = Column(
        Float,
        nullable=False
    )

    longitude = Column(
        Float,
        nullable=False
    )

    timestamp = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False
    )