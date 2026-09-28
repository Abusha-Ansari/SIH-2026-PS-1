from typing import Optional
from fastapi import APIRouter, Query
from app.providers.mock_providers import MockSatelliteProvider
from app.utils.response import error_response, success_response

router = APIRouter(tags=["Satellite"])
sat_provider = MockSatelliteProvider()


@router.get("/satellite")
async def get_satellite(scenario: Optional[str] = Query(default=None)):
    try:
        data = await sat_provider.get_satellite_observations(scenario_id=scenario or "scenario-developing")
        return success_response(data)
    except Exception as e:
        return error_response("SATELLITE_ERROR", str(e), status_code=500)
