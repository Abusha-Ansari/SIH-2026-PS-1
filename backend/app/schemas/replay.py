from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field
from app.schemas.forecast import ForecastHorizonMap
from app.schemas.lightning import LightningStrike
from app.schemas.risk import RiskAssessment
from app.schemas.storm import StormCell


class ReplayEventMetadata(BaseModel):
    id: str
    name: str
    region: str
    date: str
    description: str
    total_frames: int
    interval_minutes: int = 10
    start_time: str
    end_time: str
    has_ground_truth: bool = True


class ReplayFrame(BaseModel):
    frame_index: int
    timestamp: str
    storm_cells: List[StormCell]
    lightning_strikes: List[LightningStrike]
    forecast: ForecastHorizonMap
    risk: RiskAssessment
    ground_truth_observation: Optional[Dict[str, Any]] = None
