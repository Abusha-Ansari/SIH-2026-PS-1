from fastapi import APIRouter
from app.data.loader import MockDataLoader
from app.utils.response import success_response

router = APIRouter(tags=["Health & Scenarios"])


@router.get("/health")
async def health_check():
    return success_response({
        "status": "HEALTHY",
        "service": "THUNDER-X API Core",
        "version": "1.0.0"
    })


@router.get("/scenarios")
async def get_scenarios():
    scenarios = MockDataLoader.list_scenarios()
    return success_response(scenarios)
