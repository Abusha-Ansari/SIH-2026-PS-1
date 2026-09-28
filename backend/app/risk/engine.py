from typing import List, Optional
from app.schemas.risk import ExplainableFactor, RiskAssessment, RiskLevel
from app.schemas.storm import StormCell


class RiskEngine:
    @staticmethod
    def calculate_risk(
        thunderstorm_prob: float,
        lightning_prob: float,
        rain_intensity_mmh: float,
        storm_cells: Optional[List[StormCell]] = None,
        confidence: float = 0.90
    ) -> RiskAssessment:
        score = (
            thunderstorm_prob * 35.0 +
            lightning_prob * 35.0 +
            min(rain_intensity_mmh / 100.0, 1.0) * 30.0
        )

        factors: List[ExplainableFactor] = []

        if storm_cells and len(storm_cells) > 0:
            max_dbz = max(c.intensity_dbz for c in storm_cells)
            if max_dbz > 50:
                factors.append(ExplainableFactor(
                    category="RADAR",
                    factor_name="Elevated Radar Reflectivity Core",
                    observed_value=f"{max_dbz:.1f} dBZ",
                    threshold="> 45.0 dBZ",
                    impact_level="HIGH" if max_dbz < 60 else "CRITICAL",
                    scientific_summary="Intense precipitation core and hail formation potential detected."
                ))

        if lightning_prob > 0.70:
            factors.append(ExplainableFactor(
                category="LIGHTNING",
                factor_name="High Lightning Strike Probability",
                observed_value=f"{int(lightning_prob * 100)}%",
                threshold="> 70%",
                impact_level="HIGH",
                scientific_summary="Elevated electrostatic potential indicates imminent cloud-to-ground strikes."
            ))

        if rain_intensity_mmh > 50.0:
            factors.append(ExplainableFactor(
                category="ATMOSPHERIC",
                factor_name="Torrential Convective Rainfall",
                observed_value=f"{rain_intensity_mmh:.1f} mm/h",
                threshold="> 50.0 mm/h",
                impact_level="HIGH",
                scientific_summary="High precipitation rate likely to trigger localized urban flash ponding."
            ))

        if score >= 80.0:
            level = RiskLevel.EXTREME
            primary_threat = "SEVERE_CONVECTIVE_STORM_AND_LIGHTNING"
            recs = [
                "Issue RED alert for all municipal disaster teams.",
                "Halt outdoor and crane operations immediately.",
                "Seek enclosed shelter away from windows and open water."
            ]
        elif score >= 60.0:
            level = RiskLevel.HIGH
            primary_threat = "LIGHTNING_AND_HEAVY_DOWNPOUR"
            recs = [
                "Issue Orange Watch for suburban transit corridors.",
                "Avoid parking vehicles under large trees and near loose billboards."
            ]
        elif score >= 35.0:
            level = RiskLevel.MEDIUM
            primary_threat = "MODERATE_THUNDERSTORM"
            recs = [
                "Monitor radar nowcasting updates.",
                "Carry rain protection and keep mobile devices charged."
            ]
        else:
            level = RiskLevel.LOW
            primary_threat = "LIGHT_RESIDUAL_SHOWERS"
            recs = ["Normal operations may continue."]

        return RiskAssessment(
            level=level,
            score=round(score, 1),
            confidence=confidence,
            primary_threat=primary_threat,
            factors=factors,
            actionable_recommendations=recs
        )
