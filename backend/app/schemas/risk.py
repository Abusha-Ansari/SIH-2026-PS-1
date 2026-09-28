from enum import Enum
from typing import List, Optional
from pydantic import BaseModel, Field


class RiskLevel(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    EXTREME = "EXTREME"


class ExplainableFactor(BaseModel):
    category: str = Field(..., description="RADAR, SATELLITE, LIGHTNING, ATMOSPHERIC, TRAJECTORY")
    factor_name: str = Field(..., description="e.g. Echo Top Surge, Cloud Top Cooling")
    observed_value: str = Field(..., description="e.g. 54 dBZ, -62°C, 38 strikes/min")
    threshold: str = Field(..., description="e.g. > 45 dBZ, < -50°C")
    impact_level: str = Field(..., description="HIGH, CRITICAL, MODERATE")
    scientific_summary: str = Field(..., description="Why this indicates severe convective risk")


class RiskAssessment(BaseModel):
    level: RiskLevel
    score: float = Field(..., ge=0.0, le=100.0, description="Composite risk index (0-100)")
    confidence: float = Field(..., ge=0.0, le=1.0)
    primary_threat: str = Field(..., description="LIGHTNING, HEAVY_DOWNPOUR, DAMAGING_WINDS, HAIL")
    factors: List[ExplainableFactor] = Field(default_factory=list)
    actionable_recommendations: List[str] = Field(default_factory=list)
