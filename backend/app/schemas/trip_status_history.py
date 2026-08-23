from datetime import datetime

from pydantic import BaseModel


class TripStatusHistoryResponse(BaseModel):
    id: int
    trip_id: int
    status: str
    changed_by: int
    changed_at: datetime
    remarks: str | None = None

    class Config:
        from_attributes = True
