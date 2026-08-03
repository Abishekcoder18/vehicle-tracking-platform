from fastapi import FastAPI
from app.database.database import engine
from app.database.database import engine, Base
from app.models.user import User
from app.models.vehicle import Vehicle
from app.api.vehicle import router as vehicle_router

Base.metadata.create_all(bind=engine)
app = FastAPI(
    title="Vehicle Tracking API"
)

app.include_router(vehicle_router)
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