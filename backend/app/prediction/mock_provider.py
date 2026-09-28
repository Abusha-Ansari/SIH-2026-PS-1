from typing import Optional
from app.data.loader import MockDataLoader
from app.prediction.base import BasePredictionProvider
from app.schemas.forecast import ForecastHorizonMap
from app.schemas.prediction import MLPredictionRequest, MLPredictionResponse
from app.schemas.risk import ExplainableFactor, RiskAssessment
from app.schemas.storm import StormCell


class MockPredictionProvider(BasePredictionProvider):
    async def predict(
        self,
        request: MLPredictionRequest,
        scenario_id: Optional[str] = None
    ) -> MLPredictionResponse:
        data = MockDataLoader.load_scenario(scenario_id)
        
        forecast_raw = data.get("forecast", {})
        forecast = ForecastHorizonMap(**forecast_raw)
        
        storms = [StormCell(**c) for c in data.get("active_storm_cells", [])]
        risk = RiskAssessment(**data.get("risk_assessment", {}))
        explanation = [ExplainableFactor(**f) for f in data.get("risk_assessment", {}).get("factors", [])]
        
        return MLPredictionResponse(
            timestamp=request.timestamp or data.get("timestamp"),
            forecast=forecast,
            storms=storms,
            risk=risk,
            explanation=explanation
        )
