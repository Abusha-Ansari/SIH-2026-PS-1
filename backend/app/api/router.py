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

api_router = APIRouter(prefix="/api")

api_router.include_router(health.router)
api_router.include_router(nowcast.router)
api_router.include_router(forecast.router)
api_router.include_router(storms.router)
api_router.include_router(lightning.router)
api_router.include_router(radar.router)
api_router.include_router(satellite.router)
api_router.include_router(risk.router)
api_router.include_router(alerts.router)
api_router.include_router(replay.router)
api_router.include_router(system.router)
api_router.include_router(prediction.router)
