from enum import Enum
from typing import List, Optional
from pydantic import BaseModel, Field


class AlertSeverity(str, Enum):
    INFO = "INFO"
    WATCH = "WATCH"
    WARNING = "WARNING"
    CRITICAL = "CRITICAL"


class AlertType(str, Enum):
    THUNDERSTORM = "THUNDERSTORM"
    LIGHTNING = "LIGHTNING"
    HEAVY_RAIN = "HEAVY_RAIN"
    STORM_APPROACHING = "STORM_APPROACHING"
    HIGH_RISK = "HIGH_RISK"


class Alert(BaseModel):
    id: str
    severity: AlertSeverity
    type: AlertType
    title: str
    message: str
    region_name: str
    center_lat: float
    center_lon: float
    radius_km: float
    eta_minutes: Optional[int] = None
    created_at: str
    expires_at: str
    action_instructions: List[str] = Field(default_factory=list)
