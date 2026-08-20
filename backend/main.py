from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database.database import engine, Base

# Import all models so SQLAlchemy registers every relationship.
from app import models

from app.api.auth import router as auth_router
from app.api.vehicle import router as vehicle_router
from app.api.trip import router as trip_router
from app.api.dashboard import router as dashboard_router
from app.api.driver import router as driver_router
from app.api.vehicle_location import router as vehicle_location_router


Base.metadata.create_all(bind=engine)


app = FastAPI(title="Vehicle Tracking API")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth_router)
app.include_router(vehicle_router)
app.include_router(trip_router)
app.include_router(dashboard_router)
app.include_router(driver_router)
app.include_router(vehicle_location_router)


@app.get("/")
def home():
    return {
        "message": "Vehicle Tracking & Fleet Monitoring Platform API is running!"
    }


@app.get("/health")
def health():
    try:
        connection = engine.connect()
        connection.close()

        return {
            "status": "success",
            "database": "Connected"
        }

    except Exception as e:
        return {
            "status": "error",
            "database": str(e)
        }
