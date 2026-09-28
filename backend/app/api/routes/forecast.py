from typing import Optional
from fastapi import APIRouter, Query
from app.data.loader import MockDataLoader
from app.utils.response import error_response, success_response

router = APIRouter(tags=["Forecast"])


@router.get("/forecast")
async def get_forecast(scenario: Optional[str] = Query(default=None)):
    try:
        data = MockDataLoader.load_scenario(scenario)
        return success_response({
            "timestamp": data.get("timestamp"),
            "forecast": data.get("forecast", {}),
            "eta_minutes": data.get("current_eta_minutes"),
            "storm_distance_km": data.get("storm_distance_km"),
            "bearing_deg": data.get("bearing_deg"),
            "direction": data.get("cardinal_direction")
        })
    except Exception as e:
        return error_response("FORECAST_ERROR", str(e), status_code=500)


@router.get("/forecast/{interval}")
async def get_forecast_by_interval(interval: str, scenario: Optional[str] = Query(default=None)):
    try:
        data = MockDataLoader.load_scenario(scenario)
        forecasts = data.get("forecast", {})
        key = interval if interval.endswith("min") else f"{interval}min"
        if key not in forecasts:
            return error_response("INVALID_INTERVAL", f"Interval {interval} not found. Use 15min, 30min, 45min, 60min", status_code=404)
        return success_response(forecasts[key])
    except Exception as e:
        return error_response("FORECAST_ERROR", str(e), status_code=500)
