# THUNDER-X REST API Specification

## Base URL
`http://localhost:8000/api/v1`

## Key Endpoints

### 1. `GET /nowcast/live`
Fetches a real-time consolidated snapshot including radar storm cells, live lightning strikes, composite risk score, 60-minute forecast, AI diagnostics, and active alerts.
- **Parameters**: `scenario` (string, optional - e.g. `scenario-severe`, `scenario-developing`)
- **Response**: `NowcastResponse`

### 2. `GET /forecast/nowcast`
Stepwise convective nowcast horizons (15, 30, 45, 60 minutes).
- **Parameters**: `horizon_minutes` (integer, default: 60)
- **Response**: `ForecastResponse`

### 3. `GET /storms/cells`
Active TITAN/SCIT tracked convective storm cells with centroid, velocity, heading, and GeoJSON boundaries.
- **Response**: `StormCellCollection`

### 4. `GET /lightning/live`
Recent lightning strike telemetry (cloud-to-ground & intra-cloud) with peak current in kA.
- **Response**: `LightningObservation`

### 5. `GET /risk/assessment`
Hyperlocal convective threat categorization (Low, Moderate, High, Extreme).
- **Response**: `RiskAssessment`

### 6. `GET /alerts/active`
CAP-compliant emergency disaster bulletins.
- **Response**: `AlertListResponse`

### 7. `GET /replay/frame`
Historical event stepping for scientific verification against IMD radar ground truth.
- **Parameters**: `step` (integer, 0 to 5)
- **Response**: `ReplayFrame`

### 8. `POST /prediction/predict`
Standardized ML prediction endpoint for third-party or teammate AI models.
- **Request**: `PredictionRequest`
- **Response**: `PredictionResponse`
