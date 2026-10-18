<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=10,15,22,27&height=220&section=header&text=SchoolSportsHub&fontSize=48&fontAlignY=35&animation=twinkling&fontColor=ffffff" />
</p>

<p align="center">
  <b>Inter-School Match Marketplace, Team Roster Coordinator & Season Analytics Platform</b><br>
  <i>Empowering schools, athletic directors, and coaches with frictionless sports matchmaking and analytics.</i>
</p>

<p align="center">
  <a href="https://github.com/praneethsai050-cmd/SchoolSportsHub">
    <img src="https://img.shields.io/badge/Architecture-Single--Page_App_(SPA)-10B981?style=for-the-badge&logo=javascript&logoColor=white" />
  </a>
  <a href="https://praneethsai050-cmd.github.io">
    <img src="https://img.shields.io/badge/Author-A._Praneeth_Sai-8B5CF6?style=for-the-badge&logo=googlechrome&logoColor=white" />
  </a>
  <a href="https://www.linkedin.com/in/a-praneeth-sai-089023289/">
    <img src="https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white" />
  </a>
  <a href="mailto:praneethsai050@gmail.com">
    <img src="https://img.shields.io/badge/Email-praneethsai050@gmail.com-EA4335?style=for-the-badge&logo=gmail&logoColor=white" />
  </a>
  <a href="https://youtube.com/@flixyte">
    <img src="https://img.shields.io/badge/YouTube-@flixyte-FF0000?style=for-the-badge&logo=youtube&logoColor=white" />
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=flat-square&logo=javascript&logoColor=black" />
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white" />
  <img src="https://img.shields.io/badge/CSS3-Responsive_Flexbox_/_Grid-1572B6?style=flat-square&logo=css3&logoColor=white" />
  <img src="https://img.shields.io/badge/Storage-LocalStorage_Database-007ACC?style=flat-square" />
  <img src="https://img.shields.io/badge/Icons-Font_Awesome_6-528DD7?style=flat-square&logo=fontawesome&logoColor=white" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" />
</p>

---

## 📑 Table of Contents
- [Executive Overview](#-executive-overview)
- [The Problem in School Athletics](#-the-problem-in-school-athletics)
- [System Architecture & Workflow](#-system-architecture--workflow)
- [Core Operational Modules](#-core-operational-modules)
- [Data Models & Schema Design](#-data-models--schema-design)
- [Quickstart & Local Deployment](#-quickstart--local-deployment)
- [Repository Structure](#-repository-structure)
- [Author Profile & Hackathons](#-author-profile--hackathons)
- [Direct Transmission Hub](#-direct-transmission-hub)

---

## ⚡ Executive Overview

**SchoolSportsHub** is a responsive, client-side web application designed to modernize the management and scheduling of inter-school athletics. 

Built with pure vanilla JavaScript, HTML5, and CSS3, the platform functions as an all-in-one sports matchmaking ecosystem: enabling athletic directors and coaches to post open challenge requests, visualize nearby opponents on a simulated spatial radar map, coordinate team rosters, log scores, and compute real-time season win/loss analytics.

---

## 🎯 The Problem in School Athletics

Inter-school sports coordination is historically fragmented, reliant on manual phone calls, scattered WhatsApp groups, and lost paper rosters:
- ❌ **Match Discovery Friction:** Coaches struggle to discover schools looking for friendly scrimmages or tournament prep within geographic proximity.
- ❌ **Administrative Overhead:** Roster availability and player contact details are rarely centralized.
- ❌ **No Longitudinal Performance Data:** Season statistics, win rates, and match histories are forgotten once tournaments conclude.

### 🏆 The SchoolSportsHub Solution
1. **Match Marketplace:** Instant open challenge board with distance radius and sport filters.
2. **Smart Field Finder:** Simulated 9-cell spatial radar map displaying nearby school matches.
3. **Automated Season Analytics:** Real-time calculation of wins, losses, draws, win percentage, and dynamic performance bar charts.
4. **Interactive Roster Coordinator:** Player tracking with jersey numbers, position filters, and availability toggles.
5. **Zero-Backend Persistence:** Fully operational offline or via static web hosting using the browser's `localStorage` engine.

---

## 🏛️ System Architecture & Workflow

```
┌────────────────────────────────────────────────────────────────────────┐
│                        SCHOOLSPORTSHUB PLATFORM                        │
└────────────────────────────────────────────────────────────────────────┘
          │
          ├──► [ Coach / School Authentication ] (Login / Register / Session)
          │
          ├──► [ Match Marketplace & Field Finder ]
          │      • Multi-sport filters (⚽ Football, 🏀 Basketball, 🏏 Cricket, 🏐 Volleyball, 🏑 Hockey)
          │      • Proximity radius selector (10km, 25km, 50km, 100km)
          │      • 9-cell spatial compass radar (NW, N, NE, W, Center, E, SW, S, SE)
          │      • List vs. Grid challenge cards
          │
          ├──► [ Team Management & Roster ]
          │      • Jersey number & position assignments (Forward, Midfielder, Defender, GK, Captain)
          │      • Live availability chart & search filtering
          │      • Roster import / export utilities
          │
          ├──► [ Interactive Dashboard & Score Tracker ]
          │      • KPI cards (Wins, Losses, Draws, Win Rate %)
          │      • Dynamic CSS/JS performance bar charts
          │      • Recent match score logger & top performers leaderboard
          │
          └──► [ Client-Side LocalStorage Database ]
                 • Key: 'users', 'teams', 'matches', 'players', 'results'
```

---

## 🚀 Core Operational Modules

### 1. 🏟️ Match Marketplace & Smart Field Finder
- **Open Challenge Board:** Browse open games published by neighboring schools with date, venue, opponent name, and game rules.
- **Simulated 9-Cell Radar Map:** Interactive spatial grid showing your location at the center with relative match markers distributed across cardinal directions.
- **Proximity Filtering:** Filter challenges within 10km, 25km, 50km, or 100km radius.
- **View Toggle:** Seamlessly switch between detailed list view and compact grid card view.

### 2. 📊 Team Dashboard & Season Analytics
- **Executive Metric Cards:** Instant tally of total matches organized, active schools, registered players, and live games.
- **Dynamic Performance Charts:** Hand-crafted CSS/JS bar chart visualizing seasonal match frequency and outcome distributions.
- **Score Logger Modal:** Add match outcomes post-game with scorelines, opponent notes, and automatic win-rate re-calculation.

### 3. 👥 Roster & Player Availability Coordinator
- **Player Registry:** Maintain comprehensive player profiles with Name, Jersey #, Assigned Position, Emergency Contact, and Availability status.
- **Position Filters:** Filter squad by *Forward*, *Midfielder*, *Defender*, *Goalkeeper*, or *Captain*.
- **Search Engine:** Real-time substring player search.

### 4. ➕ Create Match Engine
- Propose customized matches specifying sport, match category, preferred date/time, home/away venue, and contact instructions.

---

## 💾 Data Models & Schema Design

All application states persist locally in browser `localStorage`:

```javascript
// User Schema
{
  "id": 1729000000000,
  "school": "St. Xavier's High School",
  "email": "coach@stxaviers.edu",
  "sport": "football",
  "location": "North Campus",
  "role": "coach",
  "createdAt": "2026-10-14T02:30:00.000Z"
}

// Match Schema
{
  "id": 101,
  "hostSchool": "Delhi Public School",
  "sport": "football",
  "date": "2026-10-25",
  "venue": "DPS Main Ground",
  "distanceKm": 12,
  "status": "open",
  "contact": "sports@dps.edu"
}
```

---

## 🛠️ Quickstart & Local Deployment

### Option 1: Direct Browser Launch (Zero Installation)
```bash
# Clone the repository
git clone https://github.com/praneethsai050-cmd/SchoolSportsHub.git
cd SchoolSportsHub

# Launch in your default web browser
# Windows:
start index.html
# Linux:
xdg-open index.html
# macOS:
open index.html
```

### Option 2: Local HTTP Server (Python)
```bash
python -m http.server 3000
```
Visit **`http://localhost:3000`** in your browser.

---

## 📂 Repository Structure

```
SchoolSportsHub/
├── index.html                   # Primary Web Application Entry Point
├── html.html                    # Source Markup & View Templates
├── style.css                    # Responsive Layout, Themes & Component Styling
├── script.js                    # 2,000+ Lines of Vanilla JS Business Logic
├── LICENSE                      # MIT Open Source License
└── README.md                    # Comprehensive System Documentation
```

---

## 👨‍💻 Author Profile & Hackathons

**A. Praneeth Sai**  
*1st-Year B.Tech CSE (Cyber Security) @ Jaypee University of Information Technology (JUIT), Waknaghat, Solan*

- 🛡️ **Flagship Venture:** Founder & Lead Backend Architect of **[Satyameva Aegis](https://github.com/praneethsai050-cmd/satyameva)** (Custom PoW Blockchain & Biometric Credentialing).
- 🏆 **Hackathon Track Record:**
  - Selected for **RIDEHACK'26 Grand Finals** (1st Nov 2026 @ JIIT Noida • Team ID: 10).
  - Team Leader for **Smart India Hackathon 2026** (`PS: SIH26125` • Team CYPHER-X).
  - 🏅 **Zonal 3rd Place** @ KVS Hackathon 1.0 (AI Vidyasetu).
- 🎬 **YouTube Channel:** Documenting college engineering hustle, systems building, and hackathons on **[@flixyte](https://youtube.com/@flixyte)**.
- 🌐 **Interactive Portfolio:** **[praneethsai050-cmd.github.io](https://praneethsai050-cmd.github.io)**

---

## 📬 Direct Transmission Hub

<p align="center">
  <a href="https://www.linkedin.com/in/a-praneeth-sai-089023289/">
    <img src="https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white" />
  </a>
  <a href="https://youtube.com/@flixyte">
    <img src="https://img.shields.io/badge/YouTube-@flixyte-FF0000?style=for-the-badge&logo=youtube&logoColor=white" />
  </a>
  <a href="mailto:261034004@juitsolan.in">
    <img src="https://img.shields.io/badge/Academic_Email-261034004@juitsolan.in-8B5CF6?style=for-the-badge&logo=gmail&logoColor=white" />
  </a>
  <a href="mailto:praneethsai050@gmail.com">
    <img src="https://img.shields.io/badge/Personal_Email-praneethsai050@gmail.com-EA4335?style=for-the-badge&logo=gmail&logoColor=white" />
  </a>
</p>

<p align="center">
  <a href="https://praneethsai050-cmd.github.io">
    <img src="https://img.shields.io/badge/🌐_Visit_My_Interactive_Web_Portfolio-10B981?style=for-the-badge&logoColor=white" />
  </a>
</p>

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=10,15,22,27&height=100&section=footer" />
</p>

<p align="center">
  <b>SchoolSportsHub</b> • <i>"Connecting schools through sportsmanship, technology, and competition."</i>
</p>
