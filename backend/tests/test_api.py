import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    json_data = response.json()
    assert json_data["success"] is True
    assert json_data["data"]["status"] == "HEALTHY"


def test_scenarios_listing():
    response = client.get("/api/scenarios")
    assert response.status_code == 200
    json_data = response.json()
    assert json_data["success"] is True
    assert len(json_data["data"]) >= 4


def test_nowcast_endpoint():
    response = client.get("/api/nowcast?scenario=scenario-developing")
    assert response.status_code == 200
    json_data = response.json()
    assert json_data["success"] is True
    data = json_data["data"]
    assert "forecast" in data
    assert "active_storm_cells" in data
    assert "risk_assessment" in data
    assert data["risk_assessment"]["level"] in ["LOW", "MEDIUM", "HIGH", "EXTREME"]
    assert data["forecast"]["15min"]["thunderstorm_probability"] > 0


def test_forecast_by_interval():
    response = client.get("/api/forecast/15min?scenario=scenario-severe")
    assert response.status_code == 200
    json_data = response.json()
    assert json_data["success"] is True
    assert json_data["data"]["interval_minutes"] == 15
    assert json_data["data"]["thunderstorm_probability"] >= 0.90


def test_storm_cells():
    response = client.get("/api/storms?scenario=scenario-developing")
    assert response.status_code == 200
    json_data = response.json()
    assert json_data["success"] is True
    assert len(json_data["data"]) > 0
    cell = json_data["data"][0]
    assert "trajectory" in cell
    assert len(cell["trajectory"]) > 0


def test_lightning_endpoint():
    response = client.get("/api/lightning?scenario=scenario-developing")
    assert response.status_code == 200
    json_data = response.json()
    assert json_data["success"] is True
    assert "total_strikes_last_15m" in json_data["data"]


def test_system_status():
    response = client.get("/api/system/status")
    assert response.status_code == 200
    json_data = response.json()
    assert json_data["success"] is True
    data = json_data["data"]
    assert data["api_status"] == "ONLINE"
    assert len(data["data_sources"]) == 5


def test_replay_events_and_frames():
    response = client.get("/api/replay/events")
    assert response.status_code == 200
    events = response.json()["data"]
    assert len(events) > 0
    event_id = events[0]["id"]

    frame_res = client.get(f"/api/replay/{event_id}/frame/0")
    assert frame_res.status_code == 200
    frame = frame_res.json()["data"]
    assert frame["frame_index"] == 0
    assert "storm_cells" in frame
    assert "ground_truth_observation" in frame
