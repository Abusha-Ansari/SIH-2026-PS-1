from enum import Enum
from typing import Dict, List, Optional
from pydantic import BaseModel, Field


class ConnectionStatus(str, Enum):
    CONNECTED = "CONNECTED"
    DEGRADED = "DEGRADED"
    OFFLINE = "OFFLINE"
    SIMULATION = "SIMULATION"


class DataSourceType(str, Enum):
    RADAR = "RADAR"
    SATELLITE = "SATELLITE"
    LIGHTNING = "LIGHTNING"
    ATMOSPHERIC = "ATMOSPHERIC"
    AI_MODEL = "AI_MODEL"


class DataSourceStatus(BaseModel):
    name: str
    type: DataSourceType
    status: ConnectionStatus
    provider: str
    latency_ms: float
    last_updated: str
    metadata: Dict[str, str] = Field(default_factory=dict)


class SystemStatusResponse(BaseModel):
    api_status: str = "ONLINE"
    prediction_provider: str
    demo_mode: bool
    active_scenario: Optional[str] = None
    server_time_utc: str
    server_time_ist: str
    data_sources: List[DataSourceStatus]
