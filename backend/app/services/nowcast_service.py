from datetime import datetime, timezone
from typing import Optional
from app.core.config import settings
from app.data.loader import MockDataLoader
from app.prediction.factory import get_prediction_provider
from app.providers.mock_providers import (
    MockAtmosphericProvider,
    MockLightningProvider,
    MockRadarProvider,
    MockSatelliteProvider,
)
from app.schemas.alert import Alert
from app.schemas.common import GeoLocation
from app.schemas.nowcast import NowcastRequest, NowcastResponse
from app.schemas.prediction import MLInputReferences, MLPredictionRequest


class NowcastService:
    def __init__(self):
        self.radar_provider = MockRadarProvider()
        self.sat_provider = MockSatelliteProvider()
        self.ltg_provider = MockLightningProvider()
        self.atmo_provider = MockAtmosphericProvider()

    async def get_nowcast(
        self,
        request: Optional[NowcastRequest] = None,
        scenario_id: Optional[str] = None
    ) -> NowcastResponse:
        sid = scenario_id or (request.scenario_id if request else None) or settings.DEFAULT_SCENARIO
        data = MockDataLoader.load_scenario(sid)

        target_loc = None
        if request and request.location:
            target_loc = request.location
        elif "target_location" in data:
            target_loc = GeoLocation(**data["target_location"])

        pred_provider = get_prediction_provider()
        ml_req = MLPredictionRequest(
            timestamp=data.get("timestamp", datetime.now(timezone.utc).isoformat()),
            location=target_loc or GeoLocation(lat=19.076, lon=72.877, name="Mumbai"),
            inputs=MLInputReferences(
                radar_reference="radar://mumbai/s-band/latest",
                satellite_reference="sat://insat3d/tir1/latest",
                lightning_reference="ltg://lldn/west-coast/latest",
                atmospheric_reference="nwp://imd-gfs/analysis/latest"
            )
        )

        pred_res = await pred_provider.predict(ml_req, scenario_id=sid)
        ltg_res = await self.ltg_provider.get_lightning_observations(scenario_id=sid)

        alerts = [Alert(**a) for a in data.get("active_alerts", [])]

        return NowcastResponse(
            timestamp=pred_res.timestamp,
            target_location=target_loc,
            time_offset_min=request.time_offset_min if request else 0,
            forecast=pred_res.forecast,
            active_storm_cells=pred_res.storms,
            lightning_observations=ltg_res,
            risk_assessment=pred_res.risk,
            active_alerts=alerts,
            explanations=pred_res.explanation,
            eta_minutes_to_target=data.get("current_eta_minutes"),
            distance_km_to_target=data.get("storm_distance_km"),
            bearing_to_target=data.get("bearing_deg")
        )
