from datetime import datetime

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from app.database.database import Base


class TripStatusHistory(Base):
    __tablename__ = "trip_status_history"

    id = Column(Integer, primary_key=True, index=True)

    trip_id = Column(
        Integer,
        ForeignKey("trips.id"),
        nullable=False,
        index=True
    )

    status = Column(String(30), nullable=False)

    changed_by = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
        index=True
    )

    changed_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False
    )

    remarks = Column(String(500), nullable=True)