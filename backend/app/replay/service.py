from typing import Any, Dict, List, Optional
from app.data.loader import MockDataLoader
from app.schemas.forecast import ForecastHorizonMap
from app.schemas.lightning import LightningStrike
from app.schemas.replay import ReplayFrame
from app.schemas.risk import RiskAssessment
from app.schemas.storm import StormCell


class ReplayService:
    @staticmethod
    def get_events() -> List[Dict[str, Any]]:
        return MockDataLoader.list_replay_events()

    @staticmethod
    def get_event_detail(event_id: str) -> Optional[Dict[str, Any]]:
        data = MockDataLoader.load_replay_event(event_id)
        if not data:
            return None
        return data

    @staticmethod
    def get_frame(event_id: str, frame_index: int) -> Optional[ReplayFrame]:
        data = MockDataLoader.load_replay_event(event_id)
        frames = data.get("frames", [])
        if frame_index < 0 or frame_index >= len(frames):
            return None
        
        f = frames[frame_index]
        return ReplayFrame(
            frame_index=f["frame_index"],
            timestamp=f["timestamp"],
            storm_cells=[StormCell(**c) for c in f.get("storm_cells", [])],
            lightning_strikes=[LightningStrike(**l) for l in f.get("lightning_strikes", [])],
            forecast=ForecastHorizonMap(**f.get("forecast", {})),
            risk=RiskAssessment(**f.get("risk", {})),
            ground_truth_observation=f.get("ground_truth_observation")
        )
