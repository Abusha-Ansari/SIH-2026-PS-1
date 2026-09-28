from typing import Any, Dict
from app.data.loader import MockDataLoader
from app.providers.base import (
    AtmosphericDataProvider,
    LightningDataProvider,
    RadarDataProvider,
    SatelliteDataProvider,
)
from app.schemas.lightning import LightningObservationResponse


class MockRadarProvider(RadarDataProvider):
    async def get_radar_observations(self, scenario_id: str = "scenario-developing") -> Dict[str, Any]:
        data = MockDataLoader.load_scenario(scenario_id)
        cells = data.get("active_storm_cells", [])
        return {
            "source": "MOCK_DOPPLER_RADAR_NETWORK",
            "station": "MUMBAI_S_BAND_RADAR",
            "timestamp": data.get("timestamp"),
            "max_reflectivity_dbz": max([c.get("intensity_dbz", 0) for c in cells], default=0),
            "storm_cells_detected": len(cells),
            "cells": cells,
            "status": "OPERATIONAL"
        }


class MockSatelliteProvider(SatelliteDataProvider):
    async def get_satellite_observations(self, scenario_id: str = "scenario-developing") -> Dict[str, Any]:
        data = MockDataLoader.load_scenario(scenario_id)
        return {
            "source": "MOCK_INSAT_3D_METEOSAT",
            "channel": "TIR1_10_8_MICRON",
            "timestamp": data.get("timestamp"),
            "min_brightness_temp_c": -64.2,
            "cloud_top_cooling_rate_c_15m": -4.1,
            "overshooting_top_detected": True,
            "status": "OPERATIONAL"
        }


class MockLightningProvider(LightningDataProvider):
    async def get_lightning_observations(self, scenario_id: str = "scenario-developing") -> LightningObservationResponse:
        data = MockDataLoader.load_scenario(scenario_id)
        ltg_raw = data.get("lightning_observations", {})
        return LightningObservationResponse(**ltg_raw)


class MockAtmosphericProvider(AtmosphericDataProvider):
    async def get_atmospheric_observations(self, scenario_id: str = "scenario-developing") -> Dict[str, Any]:
        data = MockDataLoader.load_scenario(scenario_id)
        return {
            "source": "MOCK_NWP_HIGH_RES_ANALYSIS",
            "timestamp": data.get("timestamp"),
            "cape_j_kg": 2850.0,
            "cin_j_kg": -18.0,
            "bulk_shear_0_6km_kt": 38.5,
            "lifted_index": -6.2,
            "k_index": 37.0,
            "status": "OPERATIONAL"
        }
