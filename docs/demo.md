# THUNDER-X Live Presentation & Hackathon Demo Walkthrough

## 1. Quick Start
### Backend
```bash
cd backend
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
API Documentation: `http://localhost:8000/docs`

### Frontend
```bash
cd frontend
npm run dev
```
Web Application: `http://localhost:3000`

---

## 2. 5-Minute Demo Script for Judges

### Stage 1: Live Operational Dashboard (`/dashboard`)
1. **Showcase the Real-Time Meteorological HUD**: Point out the live IST clock, sensor ingestion indicators (DWR Mumbai active, INSAT-3DR 10.8µm stream), and the Convective Threat gauge.
2. **Interactive GIS Map**: Show storm cell reflectivity envelopes (color-coded by dBZ), heading vectors, and live lightning strike markers.
3. **Basemap Switcher**: Toggle between Esri Dark Canvas, High-Resolution Satellite imagery, and Standard Street maps.
4. **Time Machine Timeline**: Step through +15m, +30m, +45m, and +60m lead horizons.

### Stage 2: Scenario Analysis
Switch scenarios via the top dropdown:
- **Mumbai Severe Squall Line**: Extreme risk, dense CG lightning cluster, 56 dBZ core.
- **Pune Developing Supercell**: Rapid vertical growth trigger.
- **Nagpur Dissipating Convection**: Weakening stratiform phase.
- **Konkan Multi-Cell Cluster**: Multiple interacting convective cores.

### Stage 3: Explainable AI & Disaster Alerts (`/alerts`)
- Show Explainable AI (XAI) diagnostics explaining meteorological triggers behind automated warnings.
- Highlight CAP-compliant early warnings ready for NDMA/SDMA dissemination.

### Stage 4: Historical Replay & Scientific Verification (`/replay`)
- Demonstrate stepwise validation against ground-truth Doppler radar data with CSI threat scores and lead-time benefit calculations.
