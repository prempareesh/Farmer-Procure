# 🌾 AgriProcure (Procure Intelligence)
### *Predictive & Trusted Agricultural Procurement Flow Platform*
**Smart India Hackathon (SIH 2026) Project**

---

## 📌 Project Overview

**AgriProcure** is an AI-powered, predictive procurement intelligence platform engineered to eliminate Mandi congestion, reduce multi-day queue wait times for farmers, and bring 100% cryptographic transparency to Minimum Support Price (MSP) grain intake operations across India.

Combining modern SaaS web architecture, real-time queue telemetry, explainable AI (XAI), and a tamper-evident SHA-256 blockchain-style audit ledger, AgriProcure ensures farmers save time, get fair value, and harvest better futures.

---

## 🚀 Key Features

### 🔐 1. Authentication & Role-Based Access
- **Farmer & Mandi Officer Sign-In**: Dedicated portals for farmers and procurement officers.
- **Registration Flow**: Complete onboarding with 10-digit mobile verification, 12-digit Aadhaar validation, village, and state profiling.
- **⚡ Quick Demo Fill**: Built-in 1-click test credentials for rapid judging evaluation.

### 👨‍🌾 2. Farmer Profile & Multi-Crop Portfolio Management
- **Farmer Digital Identity**: Stores Farmer ID, Name, Mobile, Village, State, Aadhaar, and DBT-linked bank account.
- **Multi-Crop CRUD**: Manage multiple registered crops with acreage (Acres) and expected yield (Quintals).

### 📅 3. Smart Slot Booking & Dynamic Capacity Engine
- **Procurement Centre Selection**: Multi-Mandi support (Karnal, Ludhiana, Nalgonda, Kota).
- **Live Slot Capacity**: Real-time tracking of capacity, booked slots, available slots, and `FULL` badges.
- **Cryptographic Gate Pass**: Instant generation of Booking ID (`BK-2026-XXXX`), Token Number (`P-125`), and digital QR code.

### ✨ 4. Smart AI Slot Recommendations
- **Congestion-Aware Scheduling**: Evaluates traffic patterns to recommend optimal low-wait slots (e.g. *02:00 PM – 03:00 PM • Exp. Wait: ~10 min*).
- **Staggered Intake**: Balances truck arrivals to eliminate physical bottlenecks at weighing bridges.

### ⏱ 5. Live Queue Telemetry Tracker
- **Real-Time Counters**: Displays *Now Serving at Gate*, *Your Assigned Token*, *Trucks Ahead*, and *Estimated Wait Time*.
- **Simulation Controls**: 15-second auto-ticker with manual *"Advance +1 Vehicle"* controls for live presentations.

### 🔄 6. 6-Stage Procurement Workflow Tracking
- **Complete End-to-End Lifecycle**:
  $$\text{BOOKED} \longrightarrow \text{ARRIVED} \longrightarrow \text{QUALITY CHECK} \longrightarrow \text{WEIGHING} \longrightarrow \text{PROCUREMENT} \longrightarrow \text{PAYMENT}$$
- **Live Progress Tracker**: Visual stepper showing active stage and progress metrics.
- **Cryptographic Block Logging**: Every stage transition is immutably hashed and chained.

### 🧠 7. AI Congestion Prediction & Explainable AI (XAI)
- **Predictive Intelligence**: Calculates queue turnaround and classifies risk (`LOW`, `MEDIUM`, `HIGH`).
- **Shapley-Style Factor Breakdown**: Decomposes predictions (e.g., *Queue Volume +35%*, *Crop Load +20%*, *Weighbridge Efficiency -25%*).

### 🛠 8. Bottleneck Detection & Operator Dispatch
- Real-time cycle time monitoring across Quality Labs, Weighing Scales, and Purchase Desks.
- Triggers **BOTTLENECK DETECTED** alerts with prescriptive recommendations (*"Add One More Operator at Weighbridge #2"*).

### 📱 9. QR Check-In & Gate Arrival Simulator
- Downloadable digital Mandi Pass with QR token payload.
- Physical Mandi Gate Scanner simulation that verifies the token and instantly updates booking status to **ARRIVED**.

### 🛡 10. Fraud Screening & Anomaly Engine
- Scans for duplicate booking submissions across Mandis, invalid workflow hops, and impossible timestamp gaps.
- Flags **Needs Review** alerts in Admin Dashboard with **Dismiss** and **Freeze Token** actions.

### 🔗 11. Cryptographic SHA-256 Audit Chain Ledger
- Generates `crypto.subtle.digest` SHA-256 hashes linking each stage transition (`prevHash`, `currentHash`, `timestamp`, `dataSummary`).
- **Integrity Verification**: Real-time cryptographic ledger verification (*"Hash Valid • 100% Integrity Verified"*).
- **Tamper Simulation & Consensus Repair**: Built-in test to intentionally tamper with a block and demonstrate instant anomaly detection.

### 🔔 12. Real-Time Notification Center
- Slide-out notification drawer with live unread badge counter for slot confirmations, queue updates, delay warnings, and payment receipts.

### 🏢 13. Mandi Command Tower Dashboard
- Comprehensive admin analytics with multi-mandi capacity utilization tables, KPI summaries, Explainable AI, Bottlenecks, and Fraud screening.

---

## 🛠 Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend Framework** | React 19 + Vite |
| **Styling & Design System** | Tailwind CSS v4 + Vanilla CSS Variables |
| **Icons** | Lucide React |
| **Animations** | Framer Motion + Canvas Confetti |
| **Cryptographic Security** | Web Crypto API (SHA-256 Hashing) |
| **Typography** | Plus Jakarta Sans / Inter |

---

## 💻 Getting Started & Local Setup

### 1. Clone the Repository
```bash
git clone https://github.com/preampareesh/Farmer-Procure.git
cd Farmer-Procure
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start the Development Server
```bash
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.

### 4. Build for Production
```bash
npm run build
```

---

## 🧪 Demo & Testing Credentials

| Role | Mobile / Identifier | Password | Purpose |
| :--- | :--- | :--- | :--- |
| **Farmer** | `9876543210` | `farmer2026` | Test slot booking, live queue, multi-crop CRUD & QR check-in |
| **Mandi Officer** | `OFFICER-HR-402` | `admin2026` | Test Mandi Command Tower, Bottlenecks, Fraud alerts & SHA-256 Audit |

*(Or use the 1-click **⚡ Quick Demo Fill** buttons on the Login page)*

---

## 📜 License & Credits
Developed for **Smart India Hackathon (SIH 2026)**.
Licensed under the **MIT License**.
