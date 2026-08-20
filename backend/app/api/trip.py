from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.dependencies import verify_token
from app.database.database import get_db

from app.models.trip import Trip
from app.models.driver import Driver
from app.models.vehicle import Vehicle
from app.models.user import User
from app.models.trip_status_history import TripStatusHistory

from app.schemas.trip import TripCreate, TripResponse


router = APIRouter(
    prefix="/trips",
    tags=["Trips"]
)


ALLOWED_STATUSES = {
    "Pending",
    "Active",
    "Completed",
    "Cancelled"
}


def get_current_user_id(db: Session, token_user):
    """
    Resolve the authenticated user from the JWT subject.
    The login endpoint stores the user's email in 'sub'.
    """

    email = token_user.get("sub")

    if not email:
        raise HTTPException(
            status_code=401,
            detail="Invalid authentication token"
        )

    current_user = (
        db.query(User)
        .filter(User.email == email)
        .first()
    )

    if current_user is None:
        raise HTTPException(
            status_code=401,
            detail="Authenticated user not found"
        )

    return current_user.id


def validate_driver_and_vehicle(
    db: Session,
    driver_id: int,
    vehicle_id: int
):
    driver = (
        db.query(Driver)
        .filter(Driver.id == driver_id)
        .first()
    )

    if driver is None:
        raise HTTPException(
            status_code=404,
            detail="Driver not found"
        )

    vehicle = (
        db.query(Vehicle)
        .filter(Vehicle.id == vehicle_id)
        .first()
    )

    if vehicle is None:
        raise HTTPException(
            status_code=404,
            detail="Vehicle not found"
        )

    return driver, vehicle


def validate_resources_available(
    driver: Driver,
    vehicle: Vehicle
):
    if driver.status != "Available":
        raise HTTPException(
            status_code=400,
            detail=f"Driver is not available. Current status: {driver.status}"
        )

    if vehicle.status != "Available":
        raise HTTPException(
            status_code=400,
            detail=f"Vehicle is not available. Current status: {vehicle.status}"
        )


def create_status_history(
    db: Session,
    trip_id: int,
    status: str,
    user_id: int,
    remarks: str
):
    history = TripStatusHistory(
        trip_id=trip_id,
        status=status,
        changed_by=user_id,
        remarks=remarks
    )

    db.add(history)


# ==========================================
# CREATE TRIP
# ==========================================

@router.post(
    "/",
    response_model=TripResponse,
    status_code=201
)
def create_trip(
    trip: TripCreate,
    db: Session = Depends(get_db),
    user=Depends(verify_token)
):
    if trip.status not in ALLOWED_STATUSES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid trip status. Allowed values: {sorted(ALLOWED_STATUSES)}"
        )

    if trip.status == "Completed":
        raise HTTPException(
            status_code=400,
            detail="A new trip cannot be created directly as Completed"
        )

    driver, vehicle = validate_driver_and_vehicle(
        db,
        trip.driver_id,
        trip.vehicle_id
    )

    # Pending trips reserve no resources.
    # Active trips require both resources to be available.
    if trip.status == "Active":
        validate_resources_available(driver, vehicle)

        driver.status = "On Trip"
        vehicle.status = "On Trip"

    elif trip.status == "Pending":
        if driver.status != "Available":
            raise HTTPException(
                status_code=400,
                detail=f"Driver is not available. Current status: {driver.status}"
            )

        if vehicle.status != "Available":
            raise HTTPException(
                status_code=400,
                detail=f"Vehicle is not available. Current status: {vehicle.status}"
            )

    current_user_id = get_current_user_id(db, user)

    new_trip = Trip(
        source=trip.source,
        destination=trip.destination,
        status=trip.status,
        driver_id=trip.driver_id,
        vehicle_id=trip.vehicle_id
    )

    db.add(new_trip)
    db.flush()

    create_status_history(
        db=db,
        trip_id=new_trip.id,
        status=trip.status,
        user_id=current_user_id,
        remarks="Trip created"
    )

    db.commit()
    db.refresh(new_trip)

    return new_trip


# ==========================================
# GET ALL TRIPS
# ==========================================

@router.get(
    "/",
    response_model=list[TripResponse]
)
def get_trips(
    db: Session = Depends(get_db),
    user=Depends(verify_token)
):
    return (
        db.query(Trip)
        .order_by(Trip.id.desc())
        .all()
    )


# ==========================================
# GET TRIP BY ID
# ==========================================

@router.get(
    "/{trip_id}",
    response_model=TripResponse
)
def get_trip(
    trip_id: int,
    db: Session = Depends(get_db),
    user=Depends(verify_token)
):
    trip = (
        db.query(Trip)
        .filter(Trip.id == trip_id)
        .first()
    )

    if trip is None:
        raise HTTPException(
            status_code=404,
            detail="Trip not found"
        )

    return trip


# ==========================================
# UPDATE TRIP
# ==========================================

@router.put(
    "/{trip_id}",
    response_model=TripResponse
)
def update_trip(
    trip_id: int,
    updated_trip: TripCreate,
    db: Session = Depends(get_db),
    user=Depends(verify_token)
):
    if updated_trip.status not in ALLOWED_STATUSES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid trip status. Allowed values: {sorted(ALLOWED_STATUSES)}"
        )

    trip = (
        db.query(Trip)
        .filter(Trip.id == trip_id)
        .first()
    )

    if trip is None:
        raise HTTPException(
            status_code=404,
            detail="Trip not found"
        )

    old_status = trip.status

    # Completed and Cancelled trips are terminal.
    if old_status in {"Completed", "Cancelled"}:
        raise HTTPException(
            status_code=400,
            detail=f"Trip is already {old_status} and cannot be modified"
        )

    driver, vehicle = validate_driver_and_vehicle(
        db,
        updated_trip.driver_id,
        updated_trip.vehicle_id
    )

    # ------------------------------------------
    # Pending -> Active
    # ------------------------------------------

    if old_status == "Pending" and updated_trip.status == "Active":

        validate_resources_available(driver, vehicle)

        driver.status = "On Trip"
        vehicle.status = "On Trip"

    # ------------------------------------------
    # Active -> Completed
    # ------------------------------------------

    elif old_status == "Active" and updated_trip.status == "Completed":

        driver.status = "Available"
        vehicle.status = "Available"

    # ------------------------------------------
    # Active -> Cancelled
    # ------------------------------------------

    elif old_status == "Active" and updated_trip.status == "Cancelled":

        driver.status = "Available"
        vehicle.status = "Available"

    # ------------------------------------------
    # Pending -> Cancelled
    # ------------------------------------------

    elif old_status == "Pending" and updated_trip.status == "Cancelled":

        # Nothing is reserved for Pending trips.
        pass

    # ------------------------------------------
    # Prevent reopening / invalid transitions
    # ------------------------------------------

    elif old_status == "Pending" and updated_trip.status == "Pending":

        if (
            trip.driver_id != updated_trip.driver_id
            or trip.vehicle_id != updated_trip.vehicle_id
        ):
            validate_resources_available(driver, vehicle)

    elif old_status == "Active" and updated_trip.status == "Active":

        if (
            trip.driver_id != updated_trip.driver_id
            or trip.vehicle_id != updated_trip.vehicle_id
        ):
            raise HTTPException(
                status_code=400,
                detail="Driver or vehicle cannot be reassigned while the trip is Active"
            )

    else:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid trip status transition: {old_status} -> {updated_trip.status}"
        )

    trip.source = updated_trip.source
    trip.destination = updated_trip.destination
    trip.driver_id = updated_trip.driver_id
    trip.vehicle_id = updated_trip.vehicle_id
    trip.status = updated_trip.status

    # Record history only when status actually changes.
    if old_status != updated_trip.status:

        current_user_id = get_current_user_id(
            db,
            user
        )

        create_status_history(
            db=db,
            trip_id=trip.id,
            status=updated_trip.status,
            user_id=current_user_id,
            remarks=f"Trip status changed from {old_status} to {updated_trip.status}"
        )

    db.commit()
    db.refresh(trip)

    return trip


# ==========================================
# DELETE TRIP
# ==========================================

@router.delete("/{trip_id}")
def delete_trip(
    trip_id: int,
    db: Session = Depends(get_db),
    user=Depends(verify_token)
):
    trip = (
        db.query(Trip)
        .filter(Trip.id == trip_id)
        .first()
    )

    if trip is None:
        raise HTTPException(
            status_code=404,
            detail="Trip not found"
        )

    if trip.status == "Active":
        raise HTTPException(
            status_code=400,
            detail="Active trips cannot be deleted. Complete or cancel the trip first."
        )

    # Avoid deleting trips that already have dependent tracking/history data.
    dependent_history = (
        db.query(TripStatusHistory)
        .filter(TripStatusHistory.trip_id == trip_id)
        .first()
    )

    if dependent_history:
        raise HTTPException(
            status_code=400,
            detail="Trip has status history and cannot be deleted"
        )

    db.delete(trip)
    db.commit()

    return {
        "message": "Trip deleted successfully",
        "trip_id": trip_id
    }
