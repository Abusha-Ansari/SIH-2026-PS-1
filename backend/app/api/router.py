from fastapi import APIRouter
from app.api.routes import (
    alerts,
    forecast,
    health,
    lightning,
    nowcast,
    prediction,
    radar,
    replay,
    risk,
    satellite,
    storms,
    system,
)

# Base route collection
base_router = APIRouter()

base_router.include_router(health.router)
base_router.include_router(nowcast.router)
base_router.include_router(forecast.router)
base_router.include_router(storms.router)
base_router.include_router(lightning.router)
base_router.include_router(radar.router)
base_router.include_router(satellite.router)
base_router.include_router(risk.router)
base_router.include_router(alerts.router)
base_router.include_router(replay.router)
base_router.include_router(system.router)
base_router.include_router(prediction.router)

# Support both /api and /api/v1 prefixes
api_router = APIRouter()
api_router.include_router(base_router, prefix="/api")
api_router.include_router(base_router, prefix="/api/v1")
