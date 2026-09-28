from datetime import datetime, timezone
from fastapi import APIRouter
from app.core.config import settings
from app.schemas.system import ConnectionStatus, DataSourceStatus, DataSourceType, SystemStatusResponse
from app.utils.response import success_response

router = APIRouter(tags=["System & Observability"])


@router.get("/system/status")
async def get_system_status():
    now_utc = datetime.now(timezone.utc).isoformat()
    
    sources = [
        DataSourceStatus(
            name="IMD Doppler Radar Network",
            type=DataSourceType.RADAR,
            status=ConnectionStatus.CONNECTED,
            provider="MockRadarProvider (IMD S-Band Format)",
            latency_ms=18.4,
            last_updated=now_utc,
            metadata={"station": "Mumbai Colaba / Santacruz", "band": "S-Band 2.7 GHz"}
        ),
        DataSourceStatus(
            name="INSAT-3DR Geostationary Satellite",
            type=DataSourceType.SATELLITE,
            status=ConnectionStatus.CONNECTED,
            provider="MockSatelliteProvider (MOSDAC Format)",
            latency_ms=45.2,
            last_updated=now_utc,
            metadata={"channels": "TIR1, TIR2, VIS, WV", "spatial_resolution": "4km"}
        ),
        DataSourceStatus(
            name="Lightning Location Sensor Network (LLDN)",
            type=DataSourceType.LIGHTNING,
            status=ConnectionStatus.CONNECTED,
            provider="MockLightningProvider (IITM / Damini / EarthNetworks)",
            latency_ms=8.9,
            last_updated=now_utc,
            metadata={"detection_efficiency": "98.2%", "type": "CG + IC"}
        ),
        DataSourceStatus(
            name="Atmospheric Sounding & NWP High-Res Grid",
            type=DataSourceType.ATMOSPHERIC,
            status=ConnectionStatus.CONNECTED,
            provider="MockAtmosphericProvider (IMD-GFS / WRF-Chem)",
            latency_ms=120.0,
            last_updated=now_utc,
            metadata={"grid_spacing": "3km", "update_cycle": "Hourly"}
        ),
        DataSourceStatus(
            name="AI Convective Nowcasting Core",
            type=DataSourceType.AI_MODEL,
            status=ConnectionStatus.SIMULATION if settings.PREDICTION_PROVIDER == "mock" else ConnectionStatus.CONNECTED,
            provider="MockPredictionProvider" if settings.PREDICTION_PROVIDER == "mock" else f"RealML ({settings.ML_SERVICE_URL})",
            latency_ms=22.1,
            last_updated=now_utc,
            metadata={"model_architecture": "SpatioTemporal Convective Transformer", "horizon": "15-60 min"}
        )
    ]

    res = SystemStatusResponse(
        api_status="ONLINE",
        prediction_provider=settings.PREDICTION_PROVIDER,
        demo_mode=(settings.PREDICTION_PROVIDER == "mock"),
        active_scenario=settings.DEFAULT_SCENARIO,
        server_time_utc=now_utc,
        server_time_ist=datetime.now().strftime("%Y-%m-%d %H:%M:%S IST"),
        data_sources=sources
    )

    return success_response(res.model_dump(mode="json"))
