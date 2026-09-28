from app.core.config import settings
from app.prediction.base import BasePredictionProvider
from app.prediction.mock_provider import MockPredictionProvider
from app.prediction.ml_provider import RealMLPredictionProvider


def get_prediction_provider() -> BasePredictionProvider:
    provider_type = settings.PREDICTION_PROVIDER.lower().strip()
    if provider_type == "ml":
        return RealMLPredictionProvider()
    return MockPredictionProvider()
