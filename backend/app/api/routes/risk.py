from typing import Optional
from fastapi import APIRouter, Query
from app.data.loader import MockDataLoader
from app.utils.response import error_response, success_response

router = APIRouter(tags=["Risk & Explanations"])


@router.get("/risk")
async def get_risk(scenario: Optional[str] = Query(default=None)):
    try:
        data = MockDataLoader.load_scenario(scenario)
        return success_response(data.get("risk_assessment", {}))
    except Exception as e:
        return error_response("RISK_ERROR", str(e), status_code=500)
