from abc import ABC, abstractmethod
from typing import Optional
from app.schemas.prediction import MLPredictionRequest, MLPredictionResponse


class BasePredictionProvider(ABC):
    @abstractmethod
    async def predict(
        self,
        request: MLPredictionRequest,
        scenario_id: Optional[str] = None
    ) -> MLPredictionResponse:
        pass
