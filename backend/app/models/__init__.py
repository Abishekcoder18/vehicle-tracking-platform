# Import all SQLAlchemy models so they are registered
# with the shared Base before mapper configuration.

from app.models.role import Role
from app.models.user import User
from app.models.driver import Driver
from app.models.vehicle_type import VehicleType
from app.models.vehicle import Vehicle
from app.models.trip import Trip
from app.models.vehicle_location import VehicleLocation
from app.models.trip_status_history import TripStatusHistory
from app.models.route_history import RouteHistory
from app.models.notification import Notification
from app.models.incident import Incident

__all__ = [
    "Role",
    "User",
    "Driver",
    "VehicleType",
    "Vehicle",
    "Trip",
    "VehicleLocation",
    "TripStatusHistory",
    "RouteHistory",
    "Notification",
    "Incident",
]
