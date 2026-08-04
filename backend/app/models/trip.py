from sqlalchemy import Column, Integer, String
from app.database.database import Base


class Trip(Base):
    __tablename__ = "trips"

    id = Column(Integer, primary_key=True, index=True)
    source = Column(String, nullable=False)
    destination = Column(String, nullable=False)
    driver_name = Column(String, nullable=False)
    vehicle_number = Column(String, nullable=False)
    status = Column(String, default="Pending")