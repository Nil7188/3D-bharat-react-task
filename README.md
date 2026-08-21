# 3D Bharat – Investment Intelligence Platform

A Next.js-based investment intelligence dashboard that allows users to explore investment deals, investors, portfolio activity, risk levels, ROI and investment recommendations.

## Tech Stack

- Next.js 16
- React
- Redux Toolkit
- Recharts
- JavaScript
- CSS / Inline Styling
- JSON Mock Data
- Git & GitHub

---

# Features

- Investor Dashboard
- Deal Explorer
- Investor Explorer
- Investor Profile
- Deal Details
- Investment Analytics
- ROI Visualization
- Risk Distribution
- Industry Distribution
- Risk vs ROI Analysis
- Investor Search
- Investor Filtering
- Risk Filtering
- Industry Filtering
- Sorting
- Pagination
- Investor Recommendations
- Responsive layouts

---

# Architecture

The application follows a modular Next.js App Router architecture.

```text
3D Bharat
│
├── app/
│   ├── page.js
│   ├── dashboard/
│   │   └── page.js
│   ├── deals/
│   │   ├── page.js
│   │   └── [id]/
│   │       └── page.js
│   ├── investors/
│   │   ├── page.js
│   │   └── [id]/
│   │       └── page.js
│   ├── recommendations/
│   │   └── page.js
│   └── corporate/
│       └── page.js
│
├── components/
│   └── Provider.js
│
├── store/
│   ├── store.js
│   ├── dealSlice.js
│   └── investorSlice.js
│
├── services/
│   ├── dealService.js
│   └── investorService.js
│
├── data/
│   ├── deals.json
│   └── investors.json
│
└── hooks/
    └── useDebounce.js

Architecture Explanation
1. Presentation Layer

The app/ directory contains the application's pages and UI.

Examples:

/dashboard – investment analytics
/deals – deal explorer
/deals/[id] – deal details
/investors – investor explorer
/investors/[id] – investor profile
/recommendations – investment recommendations
2. State Management Layer
store/
├── dealSlice.js
├── investorSlice.js
└── store.js
. Service Layer

The service layer separates data access from UI components.
 services/
├── dealService.js
└── investorService.js
4. Data Layer

The current version uses JSON files as mock data.

data/
├── deals.json
└── investors.json
Data Flow Design
/investors
    ↓
fetchInvestors()
    ↓
investorService.js
    ↓
investors.json
    ↓
Redux investorSlice
    ↓
Redux Store
    ↓
InvestorsPage


Installation
Clone the repository: git clone https://github.com/Nil7188/3D-bharat-react-task.git
Navigate to the project: cd 3D-bharat-react-task
Install dependencies: npm install
Run development server: npm run dev
Open:http://localhost:3000
Production Build:
Create a production build:npm run build
Start production server:npm start
Deployment

The project can be deployed using Vercel.

The application is built using Next.js and is compatible with Vercel's deployment platform

Project Status

The project is currently implemented as an investment intelligence dashboard with mock investment and investor data.

Core functionality includes dashboard analytics, investor/deal exploration, filtering, sorting, pagination, dynamic detail pages and recommendations.

# Application Routes

| Page | URL |
|------|-----|
| Home | http://localhost:3000/ |
| Dashboard | http://localhost:3000/dashboard |
| Deals | http://localhost:3000/deals |
| Deal Details | http://localhost:3000/deals/1 |
| Investors | http://localhost:3000/investors |
| Investor Profile | http://localhost:3000/investors/1 |
| Recommendations | http://localhost:3000/recommendations |
| Corporate | http://localhost:3000/corporate |

