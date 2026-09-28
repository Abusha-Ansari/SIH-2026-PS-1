from typing import List, Optional
from pydantic import BaseModel, Field


class TrajectoryPoint(BaseModel):
    offset_minutes: int = Field(..., description="0, 15, 30, 45, 60 min projection")
    timestamp: str = Field(..., description="Timestamp for projected coordinate")
    lat: float = Field(..., ge=-90.0, le=90.0)
    lon: float = Field(..., ge=-180.0, le=180.0)
    radius_km: float = Field(..., ge=0.0)
    intensity_dbz: float = Field(..., description="Radar reflectivity in dBZ")
    confidence: float = Field(default=1.0, ge=0.0, le=1.0)


class StormCell(BaseModel):
    id: str = Field(..., description="Unique cell identifier e.g., CELL-MMR-01")
    name: Optional[str] = Field(default=None)
    timestamp: str = Field(..., description="Timestamp of observation")
    lat: float = Field(..., ge=-90.0, le=90.0)
    lon: float = Field(..., ge=-180.0, le=180.0)
    intensity_dbz: float = Field(..., ge=0.0, le=90.0, description="Peak radar reflectivity (dBZ)")
    intensity_level: str = Field(..., description="MODERATE, HIGH, SEVERE, EXTREME")
    direction_deg: float = Field(..., ge=0.0, le=360.0, description="Heading in meteorological degrees")
    direction_cardinal: str = Field(..., description="Compass heading e.g., NE, ENE")
    speed_kmh: float = Field(..., ge=0.0, description="Propagation speed in km/h")
    radius_km: float = Field(..., ge=0.0, description="Effective convective radius in km")
    lightning_probability: float = Field(..., ge=0.0, le=1.0)
    risk_level: str = Field(..., description="LOW, MEDIUM, HIGH, EXTREME")
    top_altitude_km: Optional[float] = Field(default=None, description="Echo top altitude in km")
    trajectory: List[TrajectoryPoint] = Field(default_factory=list)
