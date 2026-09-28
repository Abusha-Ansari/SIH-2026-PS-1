from typing import Optional
from fastapi import APIRouter, Query
from app.data.loader import MockDataLoader
from app.utils.response import error_response, success_response

router = APIRouter(tags=["Storm Cells"])


@router.get("/storms")
async def get_storms(scenario: Optional[str] = Query(default=None)):
    try:
        data = MockDataLoader.load_scenario(scenario)
        cells = data.get("active_storm_cells", [])
        return success_response(cells)
    except Exception as e:
        return error_response("STORMS_ERROR", str(e), status_code=500)


@router.get("/storms/{storm_id}")
async def get_storm_by_id(storm_id: str, scenario: Optional[str] = Query(default=None)):
    try:
        data = MockDataLoader.load_scenario(scenario)
        cells = data.get("active_storm_cells", [])
        for cell in cells:
            if cell.get("id") == storm_id:
                return success_response(cell)
        return error_response("STORM_NOT_FOUND", f"Storm cell with ID '{storm_id}' was not found.", status_code=404)
    except Exception as e:
        return error_response("STORMS_ERROR", str(e), status_code=500)
