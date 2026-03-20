<div align="center">

<img src="https://capsule-render.vercel.app/api?type=slice&color=0:000d0a,50:001f1a,100:000d0a&height=280&section=header&text=DR%20SAFETY&fontSize=88&fontColor=00ffcc&animation=fadeIn&fontAlignY=55&desc=AI%20Driver%20Monitoring%20System&descSize=20&descAlignY=75&descColor=66ffee&stroke=00ffcc&strokeWidth=1" width="100%" />

<br/>

<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Share+Tech+Mono&weight=400&size=16&pause=800&color=00FFCC&center=true&vCenter=true&width=750&lines=%5BSYSTEM+ONLINE%5D+Driver+state+monitoring+active...;Scanning+%3E+distraction+%7C+drowsiness+%7C+posture+deviation;Edge+inference+only+%E2%80%94+zero+data+leaves+the+device;%5BALERT%5D+Micro-sleep+detected+%E2%80%94+issuing+warning..." />
</p>

<br/>

<p align="center">
  <img src="https://img.shields.io/badge/SYSTEM-ONLINE-00ffcc?style=for-the-badge&labelColor=000d0a&logo=circle&logoColor=00ffcc" />
  &nbsp;
  <img src="https://img.shields.io/badge/PROCESSING-EDGE%20ONLY-00ffcc?style=for-the-badge&labelColor=000d0a" />
  &nbsp;
  <img src="https://img.shields.io/badge/PRIVACY-FIRST-00ffcc?style=for-the-badge&labelColor=000d0a" />
  &nbsp;
  <img src="https://img.shields.io/badge/AUTHOR-FOX--KNIGHT-00ffcc?style=for-the-badge&labelColor=000d0a" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=white&labelColor=000d0a" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript&logoColor=white&labelColor=000d0a" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white&labelColor=000d0a" />
  <img src="https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white&labelColor=000d0a" />
  <img src="https://img.shields.io/badge/Edge-AI-00ffcc?style=flat-square&logoColor=white&labelColor=000d0a" />
</p>

</div>

---

```
> INITIALIZING DR SAFETY MONITOR...
> CAMERA FEED............ [CONNECTED]
> AI INFERENCE ENGINE.... [ARMED]
> ALERT SYSTEM.......... [ACTIVE]
> PRIVACY GUARD......... [ENFORCED]
> STATUS: ALL SYSTEMS OPERATIONAL
```

---

## Overview

DR Safety is a **real-time, privacy-first driver monitoring platform** — built for environments where a single lapse of attention can be fatal.

It feeds live camera streams through an on-device AI pipeline to detect distraction, drowsiness, and posture shifts the moment they happen. Audio and visual alerts fire instantly. No frames are transmitted. No data leaves the machine.

Designed for **fleet operators, automotive OEMs, road safety agencies**, and researchers who need full observability without trading driver privacy for it.

```
Camera Hardware ──▶ CameraFeed ──▶ Mode Selector ──┬──▶ useDriverAI  (Live Inference)
                                                    └──▶ useDriverSimulation (Mock)
                                                              │
                                                    Global Dashboard
                                              ┌──────────────┼──────────────┐
                                              ▼              ▼              ▼
                                         StatusPanel    AlertsList      LogTable
```

---

## Core Modules

<table>
<tr>
<td width="50%">

### 📡 Real-Time Camera Feed
```
Component : <CameraFeed />
API       : MediaStream (hardware-direct)
Latency   : Optimized per-frame
Fallback  : Graceful permission errors
```
Low-latency video capture piped directly into the AI inference layer with no intermediate buffering.

</td>
<td width="50%">

### ⚙️ Dual-Mode AI Engine
```
LIVE MODE : useDriverAI hook
           → real edge inference

SIM MODE  : useDriverSimulation hook
           → mock telemetry stream
```
Switch modes without restarting. Built for QA, demos, and edge-case testing without hardware.

</td>
</tr>
<tr>
<td width="50%">

### 🔊 Active Alert System
```
Trigger Types:
  ├── Micro-sleep    → CRITICAL
  ├── Phone usage    → CRITICAL
  ├── Gaze deviation → HIGH
  ├── Posture shift  → MEDIUM
  └── Drowsiness     → CRITICAL

Output: Audio (HTML5) + <AlertsList />
```

</td>
<td width="50%">

### 📊 Telemetry Dashboard
```
<Dashboard />   → unified session shell
<StatusPanel /> → live health metrics
<LogTable />    → full historical log
<AlertsList />  → active event queue
```
Single pane of glass for the entire driver session — real-time and historical.

</td>
</tr>
</table>

---

## System Architecture

```mermaid
graph TD
    A[📷 Camera Hardware] -->|MediaStream| B[CameraFeed Component]
    B --> C{⚙️ Mode Selector}
    C -- Live AI Mode --> D[🤖 useDriverAI\nEdge Inference]
    C -- Simulation Mode --> E[🔁 useDriverSimulation\nMock Telemetry]
    D --> F[📊 Global Dashboard]
    E --> F
    F --> G[🟢 StatusPanel]
    F --> H[🚨 AlertsList]
    F --> I[📋 LogTable]

    style A fill:#001f1a,stroke:#00ffcc,color:#fff
    style B fill:#001f1a,stroke:#00ffcc,color:#fff
    style C fill:#001f1a,stroke:#00ffcc,color:#fff
    style D fill:#001f1a,stroke:#00ffcc,color:#fff
    style E fill:#001f1a,stroke:#00ffcc,color:#fff
    style F fill:#001f1a,stroke:#00ffcc,color:#fff
    style G fill:#001f1a,stroke:#00aa88,color:#fff
    style H fill:#001f1a,stroke:#00aa88,color:#fff
    style I fill:#001f1a,stroke:#00aa88,color:#fff
```

---

## Detection Matrix

| Event | Severity | Trigger Condition | System Response |
|-------|----------|-------------------|----------------|
| 😴 **Micro-sleep** | `CRITICAL` | Eyes closed > threshold ms | Audio alarm + alert |
| 📱 **Phone usage** | `CRITICAL` | Hand-to-face proximity | Immediate alert |
| 👀 **Gaze deviation** | `HIGH` | Eyes off-road > 2s | Visual warning |
| 🪑 **Posture shift** | `MEDIUM` | Head/shoulder offset | Log entry + soft alert |
| 😵 **Drowsiness** | `CRITICAL` | PERCLOS score > 80% | Audio + visual alarm |

---

## Project Structure

```
face-recognition/
│
├── 📁 src/
│   ├── 📁 assets/                    # Static media & SVG icons
│   │
│   ├── 📁 components/
│   │   ├── AlertsList.tsx            # Real-time event notification queue
│   │   ├── CameraFeed.tsx            # Video stream handler
│   │   ├── Dashboard.tsx             # Main layout wrapper
│   │   ├── LogTable.tsx              # Historical session log
│   │   ├── ModeSelector.tsx          # Live AI ↔ Simulation toggle
│   │   ├── PrivacyPolicy.tsx         # Edge-processing disclosure
│   │   └── StatusPanel.tsx           # Quick-glance health metrics
│   │
│   ├── 📁 hooks/
│   │   ├── useDriverAI.ts            # Edge AI inference interface
│   │   └── useDriverSimulation.ts    # Mock telemetry generator
│   │
│   ├── 📁 utils/
│   │   └── audio.ts                  # Warning chime & HTML5 audio handlers
│   │
│   ├── App.tsx                       # Root application router
│   └── main.tsx                      # React DOM entry point
│
├── tailwind.config.js
├── vite.config.ts
└── package.json
```

---

## Getting Started

> **Prerequisites:** Node.js v18+ (v20 recommended) · Working webcam for live AI mode

### Boot Sequence

```bash
# 01 — Clone
git clone https://github.com/FOX-KNIGHT/face-recognition.git
cd face-recognition

# 02 — Install
npm install

# 03 — Launch
npm run dev
# → http://localhost:5173
```

> Grant camera permissions when prompted. Live AI mode requires active webcam access.

### No Camera? Use Simulation Mode

```
1. Open http://localhost:5173
2. Toggle Mode Selector → SIMULATION
3. Mock telemetry drives all components
   — alerts, logs, status panel —
   with zero hardware required.
```

---

## Module Reference

**`<ModeSelector />`**
Switches the data pipeline between physical camera AI loop and the internal simulation engine. Essential for testing UI states and alert flows without triggering real driver events.

**`<PrivacyPolicy />`**
User-facing disclosure of edge-only processing. All video inference runs locally — no frames, snapshots, or metadata are ever transmitted.

**`audio.ts`**
Binds AI trigger states to the HTML5 Audio API. A `CRITICAL_DROWSINESS` event fires an immediate audible alarm — designed to work even when the driver isn't looking at the screen.

---

## Roadmap

- [x] Real-time camera feed integration
- [x] Dual-mode: Live AI + Simulation engine
- [x] Active alert system with audio warnings
- [x] Telemetry dashboard with session logs
- [x] Privacy-first edge-only processing
- [ ] Multi-camera support — cabin + road view
- [ ] Per-driver PERCLOS calibration profiles
- [ ] Session export — CSV / PDF safety reports
- [ ] Mobile companion app (React Native)
- [ ] Fleet management multi-driver command view

---

## Author

<p align="center">
  <a href="https://github.com/FOX-KNIGHT">
    <img src="https://img.shields.io/badge/GitHub-FOX--KNIGHT-00ffcc?style=for-the-badge&logo=github&logoColor=white&labelColor=000d0a" />
  </a>
  &nbsp;
  <a href="https://www.linkedin.com/in/siddhant-jena-457350389">
    <img src="https://img.shields.io/badge/LinkedIn-Siddhant%20Jena-00ffcc?style=for-the-badge&logo=linkedin&logoColor=white&labelColor=000d0a" />
  </a>
  &nbsp;
  <a href="mailto:worksiddhant18@gmail.com">
    <img src="https://img.shields.io/badge/Email-worksiddhant18-00ffcc?style=for-the-badge&logo=gmail&logoColor=white&labelColor=000d0a" />
  </a>
</p>

---

<div align="center">

```
> SESSION ENDED
> DRIVER SAFETY SCORE: MONITORED
> DATA RETAINED: NONE
> STATUS: [SAFE]
```

<img src="https://capsule-render.vercel.app/api?type=slice&color=0:000d0a,50:001f1a,100:000d0a&height=120&section=footer&text=Proprietary%20%E2%80%94%20All%20rights%20reserved.&fontSize=15&fontColor=00aa88&animation=fadeIn" width="100%" />

</div>
