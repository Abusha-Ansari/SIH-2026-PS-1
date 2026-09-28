# ⚡ THUNDER-X
### AI-Powered Hyperlocal Thunderstorm & Lightning Nowcasting Platform
*Ministry of Earth Sciences (MoES) / India Meteorological Department (IMD)*

[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688.svg?style=flat&logo=fastapi)](https://fastapi.tiangolo.com)
[![Next.js](https://img.shields.io/badge/Next.js-14.2+-black.svg?style=flat&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6+-blue.svg?style=flat&logo=typescript)](https://www.typescriptlang.org)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4+-38B2AC.svg?style=flat&logo=tailwind-css)](https://tailwindcss.com)

---

## 🌟 Overview

**THUNDER-X** is a multimodal AI-powered meteorological decision-support platform built for 15–60 minute high-resolution nowcasting of severe convective storms, lightning strikes, and torrential rainfall.

The system ingests and fuses observations from:
- **Doppler Weather Radar** (IMD S-Band / C-Band dBZ reflectivity)
- **Geostationary Satellites** (INSAT-3DR / MOSDAC Thermal Infrared & cooling rates)
- **Lightning Sensor Networks** (LLDN High-Frequency Cloud-to-Ground & Intra-Cloud discharges)
- **NWP Models & Soundings** (CAPE, CIN, Wind Shear)

and produces real-time **15, 30, 45, and 60-minute probabilistic nowcasts**, storm cell kinematic trajectories, location-specific ETAs, and explainable meteorological factor attributions.

---

## 🚀 Key Features

1. **GIS Command Center (`/dashboard`)**: Clean Esri Dark Matter theme with interactive layers for Radar dBZ reflectivity, lightning strike pulses, forward trajectory cones, and real-time IST clock.
2. **5-Step Nowcast Time Machine**: Interactive timeline controller (`NOW → +15m → +30m → +45m → +60m`) with automated playback animation and live ETA countdown.
3. **Deterministic Demo Engine**: 4 pre-built offline-ready scenarios (*Developing Storm, Severe Squall Line, Weakening Cell, Multiple Clusters*) guaranteed to work flawlessly during hackathon judging.
4. **Explainable AI Attribution**: Transparent breakdown explaining *"Why is this area at risk?"* across radar reflectivity surge, cloud-top cooling, and lightning flash jumps.
5. **Historical Replay Studio (`/replay`)**: 10-minute historical sensor playback with **AI Forecast vs. Actual Observation** ground truth verification.
6. **Zero-Friction AIML Contract**: Clean adapter architecture allowing Person 2 (AIML Engineer) to connect their PyTorch/ONNX inference server via `POST /predict` without frontend changes.

---

## 🛠️ Quick Start

### 1. Run Backend API
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### 2. Run Frontend
```bash
cd frontend
npm install
npm run dev
```
Open **http://localhost:3000** in your browser.

---

## 🧪 Testing

```bash
cd backend
python -m pytest tests
```

---

## 📚 Documentation
- [Architecture & Design](docs/architecture.md)
- [REST API Reference](docs/api.md)
- [AIML Integration Guide](docs/ml-integration.md)
- [Hackathon Demo Script](docs/demo.md)
- [Deployment Guide](docs/deployment.md)
