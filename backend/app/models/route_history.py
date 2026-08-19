from datetime import datetime

from sqlalchemy import (
    Column,
    Integer,
    Numeric,
    DateTime,
    ForeignKey,
    JSON,
)
from sqlalchemy.orm import relationship

from app.database.database import Base


class RouteHistory(Base):
    __tablename__ = "route_history"

    id = Column(Integer, primary_key=True, index=True)

    trip_id = Column(
        Integer,
        ForeignKey("trips.id"),
        nullable=False,
        index=True
    )

    start_latitude = Column(Numeric(9, 6), nullable=False)
    start_longitude = Column(Numeric(9, 6), nullable=False)

    end_latitude = Column(Numeric(9, 6), nullable=False)
    end_longitude = Column(Numeric(9, 6), nullable=False)

    route_data = Column(JSON, nullable=True)

    distance_km = Column(Numeric(10, 2), nullable=True)

    duration_minutes = Column(Integer, nullable=True)

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False
    )

    trip = relationship(
        "Trip",
        back_populates="route_history"
    )