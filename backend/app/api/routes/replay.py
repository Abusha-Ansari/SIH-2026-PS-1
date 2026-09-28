from typing import Optional
from fastapi import APIRouter, Query
from app.replay.service import ReplayService
from app.utils.response import error_response, success_response

router = APIRouter(tags=["Historical Replay"])


@router.get("/replay/events")
async def get_replay_events():
    try:
        events = ReplayService.get_events()
        return success_response(events)
    except Exception as e:
        return error_response("REPLAY_ERROR", str(e), status_code=500)


@router.get("/replay/frame")
async def get_replay_frame_query(
    event_id: Optional[str] = Query(default="mumbai-severe-convective-event"),
    step: Optional[int] = Query(default=None),
    frame_index: Optional[int] = Query(default=None)
):
    try:
        idx = step if step is not None else (frame_index if frame_index is not None else 0)
        frame = ReplayService.get_frame(event_id, idx)
        if not frame:
            return error_response("FRAME_NOT_FOUND", f"Frame index {idx} out of bounds", status_code=404)
        return success_response(frame.model_dump(by_alias=True, mode="json"))
    except Exception as e:
        return error_response("REPLAY_ERROR", str(e), status_code=500)


@router.get("/replay/{event_id}")
async def get_replay_event_detail(event_id: str):
    try:
        data = ReplayService.get_event_detail(event_id)
        if not data:
            return error_response("EVENT_NOT_FOUND", f"Replay event '{event_id}' not found", status_code=404)
        return success_response(data)
    except Exception as e:
        return error_response("REPLAY_ERROR", str(e), status_code=500)


@router.get("/replay/{event_id}/frame/{frame_index}")
async def get_replay_frame(event_id: str, frame_index: int):
    try:
        frame = ReplayService.get_frame(event_id, frame_index)
        if not frame:
            return error_response("FRAME_NOT_FOUND", f"Frame index {frame_index} out of bounds", status_code=404)
        return success_response(frame.model_dump(by_alias=True, mode="json"))
    except Exception as e:
        return error_response("REPLAY_ERROR", str(e), status_code=500)


@router.post("/replay/{event_id}/start")
async def start_replay(event_id: str):
    return success_response({"event_id": event_id, "status": "PLAYING", "current_frame": 0})


@router.post("/replay/{event_id}/pause")
async def pause_replay(event_id: str):
    return success_response({"event_id": event_id, "status": "PAUSED"})


@router.post("/replay/{event_id}/reset")
async def reset_replay(event_id: str):
    return success_response({"event_id": event_id, "status": "RESET", "current_frame": 0})
