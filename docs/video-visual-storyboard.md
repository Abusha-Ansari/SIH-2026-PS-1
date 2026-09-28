# THUNDER-X — Video Visual Storyboard & Shot-by-Shot Guide

This guide details **exact visuals, motion graphics, UI recordings, and overlay callouts** to use while recording and editing your 3-minute hackathon presentation video.

---

## 🎬 Master Shot-by-Shot Storyboard

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 0:00 - 0:35  │ Part 1: Problem & Mission (Thunderstorm B-Roll + Platform HUD) │
│ 0:35 - 1:20  │ Part 2: Live GIS Map, Doppler Echoes & Strike Telemetry        │
│ 1:20 - 1:55  │ Part 3: Deep-Learning AI Model & Convective Time Machine      │
│ 1:55 - 2:30  │ Part 4: Automated CAP Alerts & Multi-Scenario Switching        │
│ 2:30 - 3:00  │ Part 5: Historical Replay, Ground Truth CSI Verification      │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### **Scene 1: Problem & Vision [0:00 – 0:35]**
* **Primary Visual:**
  - *First 8 seconds:* Dark, moody B-roll of storm clouds and dramatic cloud-to-ground lightning discharge (or high-contrast satellite animation of an Indian monsoon squall).
  - *At 0:08:* Smooth zoom-in transition into the **THUNDER-X Web Dashboard** (`http://localhost:3000/dashboard`).
* **On-Screen Overlays:**
  - Text badge: `"PROBLEM: 2,500+ Annual Lightning Fatalities in India | Rapid Convective Inception"`.
  - Highlight box glowing around the **"MoES / IMD Prototype"** header pill and live IST clock.

---

### **Scene 2: Live GIS Command Center [0:35 – 1:20]**
* **Primary Visual:**
  - Full-screen capture of the GIS Map on `/dashboard` or `/nowcast`.
  - Mouse smoothly hovers over a **Storm Cell envelope** (displaying the popup: `Peak dBZ: 56 dBZ`, `Heading: 68°`, `Velocity: 42 km/h`).
  - Click the **Basemap Switcher** in the top-right: Switch from *Esri Dark Canvas* $\to$ *High-Res Satellite* $\to$ *Back to Dark Canvas*.
* **On-Screen Overlays:**
  - Lower-third label: `"Multi-Sensor Ingestion: DWR Mumbai (S-Band) + INSAT-3DR (10.8µm) + LLDN Network"`.
  - Zoom bubble on glowing red lightning strike markers with tooltips showing `"38.4 kA Cloud-to-Ground Strike"`.

---

### **Scene 3: Dedicated AI Model & Convective Time Machine [1:20 – 1:55]**
*This is the most critical segment for judging AI innovation.*

#### 🖼️ **Visual 1 (0:10s): Multi-Modal 6-Channel Input Stack Graphic**
* Display a 3D isometric stack of 6 semi-transparent layered grids feeding into the neural net:
  1. `Layer 1: Doppler Max dBZ Grid`
  2. `Layer 2: Vertically Integrated Liquid (VIL)`
  3. `Layer 3: INSAT-3DR 10.8µm Brightness Temp (BT)`
  4. `Layer 4: Lightning Density Heatmap`
  5. `Layer 5: CAPE Thermodynamic Field`
  6. `Layer 6: 0–6km Bulk Wind Shear`
* *Motion:* Layers slide together into a single 3D tensor $[3 \times 6 \times 128 \times 128]$.

#### 🖼️ **Visual 2 (0:10s): Neural Architecture Flow Diagram**
* Animated flow diagram:
  `Spatial 3D-CNN` + `Temporal ConvLSTM` $\to$ `Cross-Attention Fusion` $\to$ `Dual Decoders (dBZ + Lightning Probability)`.

#### 🖼️ **Visual 3 (0:15s): Live UI Time-Machine Demonstration**
* Screen recording of clicking the timeline buttons on the dashboard:
  - Click `+15m` $\to$ storm envelope shifts NE, dBZ intensifies to 54.
  - Click `+30m` $\to$ lightning strike probability rises to 88%.
  - Click `+45m` & `+60m` $\to$ peak downpour forecast updates.
* Highlight the **Explainable AI (XAI) Diagnostics Card** on the left with glowing callouts for:
  - `"Echo Top Surge: 13.8 km (+35% in 10m)"`
  - `"Cloud Top Cooling: < 215 K"`

---

### **Scene 4: Disaster Alerts & Multi-Scenario Switching [1:55 – 2:30]**
* **Primary Visual:**
  - Click the top scenario dropdown: Switch from `Mumbai Severe Squall Line` $\to$ `Pune Developing Supercell`. Show the dashboard instantaneously re-computing the map, risk score, and XAI triggers.
  - Click **Disaster Alerts** (`/alerts`): Scroll through standard CAP emergency bulletins with urgency, target radius, and public safety instructions.
* **On-Screen Overlays:**
  - Green checkmark badge: `"CAP (Common Alerting Protocol) Compliant — NDMA / SDMA Ready"`.

---

### **Scene 5: Historical Replay & Scientific Verification [2:30 – 3:00]**
* **Primary Visual:**
  - Navigate to `/replay`.
  - Click **Play Replay**: Show the stepwise storm progression across timestamps $T_0 \to T_5$.
  - Zoom in on the **Ground Truth Verification Card** showing Doppler Radar Core alignment within 2.3km.
* **On-Screen Overlays (Side-by-Side Comparison Graphic):**
  - High-impact comparison card:
    - 🟢 **Critical Success Index (CSI): 0.88** (vs 0.52 baseline)
    - 🟢 **Probability of Detection (POD): 0.94**
    - 🟢 **False Alarm Ratio (FAR): 0.07**
    - 🚀 **Lead Time Gain: +38 Minutes**
* **Ending Screen (Final 5 seconds):**
  - Clean branded outro slide with **THUNDER-X** logo, GitHub repository link, and team name.

---

## 🎨 Recommended Video Editing Specs
- **Resolution:** 1920x1080 (1080p 60fps)
- **Primary Color Palette:** Deep Slate (`#020617`), Neon Cyan (`#38bdf8`), Amber (`#fbbf24`), Convective Red (`#ef4444`).
- **Cursor Effects:** Subtle glowing circle around mouse cursor for clear visual tracking during clicks.
