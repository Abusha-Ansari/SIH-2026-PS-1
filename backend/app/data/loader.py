import json
import os
from typing import Any, Dict, List, Optional
from app.core.config import settings


class MockDataLoader:
    _cache: Dict[str, Dict[str, Any]] = {}
    _replay_cache: Dict[str, Dict[str, Any]] = {}

    @classmethod
    def load_scenario(cls, scenario_id: Optional[str] = None) -> Dict[str, Any]:
        sid = scenario_id or settings.DEFAULT_SCENARIO
        if not sid.endswith(".json"):
            filename = f"{sid}.json"
        else:
            filename = sid

        if filename in cls._cache:
            return cls._cache[filename]

        filepath = os.path.join(settings.MOCK_DATA_DIR, filename)
        if not os.path.exists(filepath):
            filepath = os.path.join(settings.MOCK_DATA_DIR, "scenario-developing.json")

        with open(filepath, "r", encoding="utf-8") as f:
            data = json.load(f)
            cls._cache[filename] = data
            return data

    @classmethod
    def list_scenarios(cls) -> List[Dict[str, str]]:
        scenarios = []
        if os.path.exists(settings.MOCK_DATA_DIR):
            for fname in os.listdir(settings.MOCK_DATA_DIR):
                if fname.endswith(".json"):
                    fpath = os.path.join(settings.MOCK_DATA_DIR, fname)
                    try:
                        with open(fpath, "r", encoding="utf-8") as f:
                            data = json.load(f)
                            scenarios.append({
                                "id": data.get("scenario_id", fname.replace(".json", "")),
                                "name": data.get("name", fname),
                                "description": data.get("description", "")
                            })
                    except Exception:
                        pass
        return scenarios

    @classmethod
    def load_replay_event(cls, event_id: str = "mumbai-severe-convective-event") -> Dict[str, Any]:
        if not event_id.endswith(".json"):
            filename = f"{event_id}.json"
        else:
            filename = event_id

        if filename in cls._replay_cache:
            return cls._replay_cache[filename]

        filepath = os.path.join(settings.REPLAY_DATA_DIR, filename)
        if not os.path.exists(filepath):
            filepath = os.path.join(settings.REPLAY_DATA_DIR, "mumbai-severe-convective-event.json")

        with open(filepath, "r", encoding="utf-8") as f:
            data = json.load(f)
            cls._replay_cache[filename] = data
            return data

    @classmethod
    def list_replay_events(cls) -> List[Dict[str, Any]]:
        events = []
        if os.path.exists(settings.REPLAY_DATA_DIR):
            for fname in os.listdir(settings.REPLAY_DATA_DIR):
                if fname.endswith(".json"):
                    fpath = os.path.join(settings.REPLAY_DATA_DIR, fname)
                    try:
                        with open(fpath, "r", encoding="utf-8") as f:
                            data = json.load(f)
                            if "event" in data:
                                events.append(data["event"])
                    except Exception:
                        pass
        return events
