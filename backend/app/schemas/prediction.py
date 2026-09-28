from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field
from app.schemas.common import GeoLocation
from app.schemas.forecast import ForecastHorizonMap
from app.schemas.risk import ExplainableFactor, RiskAssessment
from app.schemas.storm import StormCell


class MLInputReferences(BaseModel):
    radar_reference: Optional[str] = Field(default=None, description="URL/URI to radar mosaic or tensor matrix")
    satellite_reference: Optional[str] = Field(default=None, description="URL/URI to INSAT/satellite IR channel data")
    lightning_reference: Optional[str] = Field(default=None, description="URL/URI to lightning event stream")
    atmospheric_reference: Optional[str] = Field(default=None, description="URL/URI to NWP/CAPE/Shear sounding grid")


class MLPredictionRequest(BaseModel):
    timestamp: str = Field(..., description="Target reference timestamp ISO 8601")
    location: GeoLocation
    inputs: MLInputReferences = Field(default_factory=MLInputReferences)


class MLPredictionResponse(BaseModel):
    timestamp: str
    forecast: ForecastHorizonMap
    storms: List[StormCell] = Field(default_factory=list)
    risk: RiskAssessment
    explanation: List[ExplainableFactor] = Field(default_factory=list)
