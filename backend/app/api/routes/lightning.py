from typing import Optional
from fastapi import APIRouter, Query
from app.providers.mock_providers import MockLightningProvider
from app.utils.response import error_response, success_response

router = APIRouter(tags=["Lightning"])
lightning_provider = MockLightningProvider()


@router.get("/lightning")
@router.get("/lightning/live")
async def get_lightning(
    scenario: Optional[str] = Query(default=None),
    scenario_id: Optional[str] = Query(default=None)
):
    try:
        active_scenario = scenario or scenario_id or "scenario-developing"
        data = await lightning_provider.get_lightning_observations(scenario_id=active_scenario)
        return success_response(data.model_dump(mode="json"))
    except Exception as e:
        return error_response("LIGHTNING_ERROR", str(e), status_code=500)
