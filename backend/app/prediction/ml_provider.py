import logging
from typing import Optional
import httpx
from app.core.config import settings
from app.prediction.base import BasePredictionProvider
from app.schemas.prediction import MLPredictionRequest, MLPredictionResponse

logger = logging.getLogger(__name__)


class RealMLPredictionProvider(BasePredictionProvider):
    def __init__(self, service_url: Optional[str] = None, timeout_seconds: float = 10.0):
        self.service_url = service_url or settings.ML_SERVICE_URL
        self.timeout = timeout_seconds

    async def predict(
        self,
        request: MLPredictionRequest,
        scenario_id: Optional[str] = None
    ) -> MLPredictionResponse:
        endpoint = f"{self.service_url.rstrip('/')}/predict"
        payload = request.model_dump(by_alias=True, mode="json")

        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.post(endpoint, json=payload)
                response.raise_for_status()
                raw_json = response.json()
                return MLPredictionResponse(**raw_json)
        except httpx.HTTPStatusError as e:
            logger.error(f"ML Service HTTP error: {e.response.status_code} - {e.response.text}")
            raise RuntimeError(f"ML Model inference returned status {e.response.status_code}")
        except httpx.RequestError as e:
            logger.error(f"ML Service connection failure to {endpoint}: {str(e)}")
            raise RuntimeError(f"Could not connect to ML Service at {self.service_url}")
        except Exception as e:
            logger.error(f"Unexpected error in ML prediction adapter: {str(e)}")
            raise RuntimeError(f"ML inference processing failed: {str(e)}")
