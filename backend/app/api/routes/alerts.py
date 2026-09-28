from typing import Optional
from fastapi import APIRouter, Query
from app.data.loader import MockDataLoader
from app.utils.response import error_response, success_response

router = APIRouter(tags=["Alerts"])


@router.get("/alerts")
@router.get("/alerts/active")
async def get_alerts(
    scenario: Optional[str] = Query(default=None),
    scenario_id: Optional[str] = Query(default=None)
):
    try:
        active_scenario = scenario or scenario_id
        data = MockDataLoader.load_scenario(active_scenario)
        return success_response(data.get("active_alerts", []))
    except Exception as e:
        return error_response("ALERTS_ERROR", str(e), status_code=500)
