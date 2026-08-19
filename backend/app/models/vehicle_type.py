from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

from app.database.database import Base


class VehicleType(Base):
    __tablename__ = "vehicle_types"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(
        String(50),
        unique=True,
        nullable=False
    )

    description = Column(
        String(255),
        nullable=True
    )

    vehicles = relationship(
        "Vehicle",
        back_populates="vehicle_type"
    )