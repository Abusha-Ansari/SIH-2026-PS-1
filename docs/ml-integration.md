# ML Model Integration Guide (Person 2 / ML Teammate)

## Overview
THUNDER-X provides a decoupled, contract-first integration interface so machine learning teammates can connect their ConvLSTM, U-Net, or LightGBM models without modifying the frontend or full-stack pipeline.

## Integration Interface

### 1. Environment Switch
In `backend/.env`:
```env
PREDICTION_PROVIDER=ml
ML_SERVICE_URL=http://localhost:5000/predict
```

### 2. Standardized JSON Schema
Send a `POST` request to `/api/v1/prediction/predict` with:
```json
{
  "radar_matrix_shape": [128, 128],
  "lead_time_minutes": 30,
  "satellite_ir_bt": 218.5,
  "lightning_strike_count_10m": 42
}
```

### 3. Expected Response Payload
```json
{
  "prediction_id": "pred-ml-98213",
  "model_name": "SpatioTemporal-UNet-v2",
  "confidence_score": 0.93,
  "predicted_dbz": 54.2,
  "lightning_probability": 0.89,
  "ai_reasoning": [
    "Rapid vertical growth in radar echo top exceeding 13.5km",
    "INSAT-3DR 10.8µm brightness temperature anomaly below 215K",
    "High density Cloud-to-Ground lightning cluster detected"
  ],
  "lead_time_minutes": 30,
  "timestamp": "2026-09-28T12:00:00Z"
}
```
