from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field
from app.schemas.common import GeoLocation


class ForecastInterval(BaseModel):
    interval_minutes: int = Field(..., description="Forecast horizon: 15, 30, 45, 60")
    target_timestamp: str = Field(..., description="ISO 8601 target time")
    thunderstorm_probability: float = Field(..., ge=0.0, le=1.0, description="Probability between 0.0 and 1.0")
    lightning_probability: float = Field(..., ge=0.0, le=1.0, description="Probability between 0.0 and 1.0")
    rain_intensity_mmh: float = Field(..., ge=0.0, description="Expected precipitation in mm/hr")
    storm_intensity: str = Field(..., description="Intensity tag: LOW, MODERATE, HIGH, SEVERE")
    confidence: float = Field(..., ge=0.0, le=1.0, description="Prediction model confidence")


class ForecastHorizonMap(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    min15: ForecastInterval = Field(alias="15min")
    min30: ForecastInterval = Field(alias="30min")
    min45: ForecastInterval = Field(alias="45min")
    min60: ForecastInterval = Field(alias="60min")


class LocationForecast(BaseModel):
    location: GeoLocation
    forecasts: ForecastHorizonMap
    current_eta_minutes: Optional[int] = Field(default=None, description="Minutes until storm cell arrival")
    storm_distance_km: Optional[float] = Field(default=None, description="Distance to nearest active storm cell")
    bearing_deg: Optional[float] = Field(default=None, description="Bearing angle toward storm")
    cardinal_direction: Optional[str] = Field(default=None, description="Direction (e.g., NE, SW)")
