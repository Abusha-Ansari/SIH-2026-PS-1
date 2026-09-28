from fastapi import APIRouter
from app.prediction.factory import get_prediction_provider
from app.schemas.prediction import MLPredictionRequest
from app.utils.response import error_response, success_response

router = APIRouter(tags=["ML Prediction Endpoint"])


@router.post("/prediction")
async def execute_prediction(body: MLPredictionRequest):
    try:
        provider = get_prediction_provider()
        res = await provider.predict(body)
        return success_response(res.model_dump(by_alias=True, mode="json"))
    except Exception as e:
        return error_response("PREDICTION_UNAVAILABLE", str(e), status_code=503)
