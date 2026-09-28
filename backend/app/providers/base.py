from abc import ABC, abstractmethod
from typing import Any, Dict
from app.schemas.lightning import LightningObservationResponse


class RadarDataProvider(ABC):
    @abstractmethod
    async def get_radar_observations(self, scenario_id: str = "scenario-developing") -> Dict[str, Any]:
        pass


class SatelliteDataProvider(ABC):
    @abstractmethod
    async def get_satellite_observations(self, scenario_id: str = "scenario-developing") -> Dict[str, Any]:
        pass


class LightningDataProvider(ABC):
    @abstractmethod
    async def get_lightning_observations(self, scenario_id: str = "scenario-developing") -> LightningObservationResponse:
        pass


class AtmosphericDataProvider(ABC):
    @abstractmethod
    async def get_atmospheric_observations(self, scenario_id: str = "scenario-developing") -> Dict[str, Any]:
        pass
