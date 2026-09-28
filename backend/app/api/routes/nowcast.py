from typing import Optional
from fastapi import APIRouter, Query
from app.schemas.common import GeoLocation
from app.schemas.nowcast import NowcastRequest
from app.services.nowcast_service import NowcastService
from app.utils.response import error_response, success_response

router = APIRouter(tags=["Nowcast"])
nowcast_service = NowcastService()


@router.get("/nowcast")
@router.get("/nowcast/live")
async def get_nowcast_get(
    scenario: Optional[str] = Query(default=None, description="Scenario identifier"),
    scenario_id: Optional[str] = Query(default=None, description="Scenario identifier alias"),
    lat: Optional[float] = Query(default=None),
    lon: Optional[float] = Query(default=None),
    time_offset: int = Query(default=0, ge=0, le=60),
    time_offset_min: int = Query(default=0, ge=0, le=60)
):
    try:
        active_scenario = scenario or scenario_id
        offset = time_offset or time_offset_min
        req = None
        if lat is not None and lon is not None:
            req = NowcastRequest(
                location=GeoLocation(lat=lat, lon=lon),
                scenario_id=active_scenario,
                time_offset_min=offset
            )
        elif offset > 0:
            req = NowcastRequest(
                scenario_id=active_scenario,
                time_offset_min=offset
            )
        result = await nowcast_service.get_nowcast(request=req, scenario_id=active_scenario)
        return success_response(result.model_dump(by_alias=True, mode="json"))
    except Exception as e:
        return error_response("NOWCAST_ERROR", str(e), status_code=500)


@router.post("/nowcast")
@router.post("/nowcast/live")
async def get_nowcast_post(body: NowcastRequest):
    try:
        result = await nowcast_service.get_nowcast(request=body, scenario_id=body.scenario_id)
        return success_response(result.model_dump(by_alias=True, mode="json"))
    except Exception as e:
        return error_response("NOWCAST_ERROR", str(e), status_code=500)
