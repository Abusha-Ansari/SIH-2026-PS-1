from datetime import datetime, timezone
from typing import Generic, Optional, TypeVar
from pydantic import BaseModel, Field

T = TypeVar("T")


class GeoLocation(BaseModel):
    lat: float = Field(..., ge=-90.0, le=90.0, description="Latitude in decimal degrees")
    lon: float = Field(..., ge=-180.0, le=180.0, description="Longitude in decimal degrees")
    name: Optional[str] = Field(default=None, description="Location name or identifier")


class BoundingBox(BaseModel):
    min_lat: float = Field(..., ge=-90.0, le=90.0)
    min_lon: float = Field(..., ge=-180.0, le=180.0)
    max_lat: float = Field(..., ge=-90.0, le=90.0)
    max_lon: float = Field(..., ge=-180.0, le=180.0)


class ApiError(BaseModel):
    code: str = Field(..., description="Machine-readable error code")
    message: str = Field(..., description="Human-readable error description")
    details: Optional[dict] = Field(default=None, description="Optional diagnostic details")


class ApiResponse(BaseModel, Generic[T]):
    success: bool = Field(..., description="True if request succeeded, False otherwise")
    data: Optional[T] = Field(default=None, description="Payload data when success is True")
    error: Optional[ApiError] = Field(default=None, description="Error details when success is False")
    timestamp: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
