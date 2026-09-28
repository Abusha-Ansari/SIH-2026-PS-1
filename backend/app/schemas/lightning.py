from typing import List, Optional
from pydantic import BaseModel, Field


class LightningStrike(BaseModel):
    id: str = Field(..., description="Unique strike ID")
    timestamp: str = Field(..., description="ISO 8601 observation time")
    lat: float = Field(..., ge=-90.0, le=90.0)
    lon: float = Field(..., ge=-180.0, le=180.0)
    peak_current_ka: float = Field(..., description="Peak discharge current in kiloamperes")
    strike_type: str = Field(..., description="CG (Cloud-to-Ground) or IC (Intra-Cloud)")
    polarity: str = Field(..., description="POSITIVE or NEGATIVE")


class LightningDensityGrid(BaseModel):
    lat: float
    lon: float
    flash_count_per_sqkm: float
    risk_level: str


class LightningObservationResponse(BaseModel):
    timestamp: str
    total_strikes_last_15m: int
    cg_strikes_count: int
    ic_strikes_count: int
    strikes: List[LightningStrike]
    density_heatmap: List[LightningDensityGrid]
