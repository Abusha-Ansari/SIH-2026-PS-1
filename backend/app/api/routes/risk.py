from typing import Optional
from fastapi import APIRouter, Query
from app.data.loader import MockDataLoader
from app.utils.response import error_response, success_response

router = APIRouter(tags=["Risk & Explanations"])


@router.get("/risk")
@router.get("/risk/assessment")
async def get_risk(
    scenario: Optional[str] = Query(default=None),
    scenario_id: Optional[str] = Query(default=None)
):
    try:
        active_scenario = scenario or scenario_id
        data = MockDataLoader.load_scenario(active_scenario)
        return success_response(data.get("risk_assessment", {}))
    except Exception as e:
        return error_response("RISK_ERROR", str(e), status_code=500)
