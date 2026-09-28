from typing import Optional
from fastapi import APIRouter, Query
from app.providers.mock_providers import MockRadarProvider
from app.utils.response import error_response, success_response

router = APIRouter(tags=["Radar"])
radar_provider = MockRadarProvider()


@router.get("/radar")
async def get_radar(scenario: Optional[str] = Query(default=None)):
    try:
        data = await radar_provider.get_radar_observations(scenario_id=scenario or "scenario-developing")
        return success_response(data)
    except Exception as e:
        return error_response("RADAR_ERROR", str(e), status_code=500)
