# THUNDER-X Architecture & System Design

## 1. Executive Summary
**THUNDER-X** is an AI-driven, hyperlocal nowcasting and lightning early-warning platform designed for the Ministry of Earth Sciences (MoES) and the India Meteorological Department (IMD). It bridges radar, satellite, and lightning observations into actionable convective threat assessments with 0–60 minute lead time.

## 2. Monorepo Structure
```
New-SIH/
├── backend/                  # FastAPI (Python 3.11/3.13)
│   ├── app/
│   │   ├── api/routes/       # REST API endpoints (nowcast, forecast, storms, etc.)
│   │   ├── core/             # Configuration and environment settings
│   │   ├── data/             # Scenario loader
│   │   ├── prediction/       # Swappable ML & Mock prediction engine
│   │   ├── providers/        # Radar, satellite, and lightning providers
│   │   ├── replay/           # Stepwise historical verification engine
│   │   ├── risk/             # Composite convective threat scoring
│   │   ├── schemas/          # Strict Pydantic V2 models
│   │   └── services/         # Aggregators and business logic
│   └── tests/                # Pytest unit & integration test suite
├── frontend/                 # Next.js 14 (App Router) + Tailwind CSS + Leaflet
│   ├── app/                  # Dashboard, nowcast, forecast, alerts, replay, system
│   ├── components/           # GIS MapEngine, HUD cards, timelines
│   ├── lib/                  # Axios API client and utilities
│   └── types/                # TypeScript interfaces matching backend schemas
├── data/
│   ├── mock/                 # 4 deterministic weather scenarios
│   └── replay/               # Mumbai Severe Convective storm verification dataset
└── docs/                     # Full technical documentation
```

## 3. Core Subsystems

### Convective Risk Engine
Computes a composite threat score $[0.0, 1.0]$ based on weighted multi-source components:
- **Reflectivity Factor (35%)**: Radar echo intensity (dBZ thresholding).
- **Lightning Flash Rate (35%)**: Cloud-to-ground (CG) and intra-cloud (IC) frequency.
- **Vertical Growth Rate (20%)**: Echo-top acceleration ($>12\text{ km}$).
- **Severe Weather Parameters (10%)**: VIL and shear indices.

### Prediction Abstraction Layer
Supports hot-swapping between `MockPredictionProvider` (development) and `MLPredictionProvider` (production deep learning models like ConvLSTM/U-Net) via `PREDICTION_PROVIDER=ml`.
