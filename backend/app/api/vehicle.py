from fastapi import APIRouter

router = APIRouter(prefix="/vehicles", tags=["Vehicles"])


@router.get("/")
def get_vehicles():
    return {
        "message": "Vehicle API working!"
    }