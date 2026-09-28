from datetime import datetime, timezone
from typing import Any, Optional
from fastapi.responses import JSONResponse
from app.schemas.common import ApiError, ApiResponse


def success_response(data: Any, status_code: int = 200) -> JSONResponse:
    payload = ApiResponse(
        success=True,
        data=data,
        error=None,
        timestamp=datetime.now(timezone.utc).isoformat(),
    )
    return JSONResponse(
        status_code=status_code,
        content=payload.model_dump(by_alias=True, mode="json"),
    )


def error_response(
    code: str,
    message: str,
    details: Optional[dict] = None,
    status_code: int = 400,
) -> JSONResponse:
    payload = ApiResponse(
        success=False,
        data=None,
        error=ApiError(code=code, message=message, details=details),
        timestamp=datetime.now(timezone.utc).isoformat(),
    )
    return JSONResponse(
        status_code=status_code,
        content=payload.model_dump(by_alias=True, mode="json"),
    )
