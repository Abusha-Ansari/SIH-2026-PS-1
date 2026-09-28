from typing import List, Optional
from pydantic import BaseModel, Field
from app.schemas.alert import Alert
from app.schemas.common import GeoLocation
from app.schemas.forecast import ForecastHorizonMap
from app.schemas.lightning import LightningObservationResponse
from app.schemas.risk import ExplainableFactor, RiskAssessment
from app.schemas.storm import StormCell


class NowcastRequest(BaseModel):
    location: Optional[GeoLocation] = None
    scenario_id: Optional[str] = None
    time_offset_min: int = Field(default=0, ge=0, le=60)


class NowcastResponse(BaseModel):
    timestamp: str
    target_location: Optional[GeoLocation] = None
    time_offset_min: int = 0
    forecast: ForecastHorizonMap
    active_storm_cells: List[StormCell]
    lightning_observations: LightningObservationResponse
    risk_assessment: RiskAssessment
    active_alerts: List[Alert]
    explanations: List[ExplainableFactor]
    eta_minutes_to_target: Optional[int] = None
    distance_km_to_target: Optional[float] = None
    bearing_to_target: Optional[float] = None
