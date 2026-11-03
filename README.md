# Business Listings Dashboard

An enterprise-grade, responsive full-stack admin dashboard for managing and analyzing business listings across multiple cities and industries. Built for high performance, clean visual aesthetics, and database scalability.

---

## Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS, Recharts, Lucide React |
| **Backend** | Python 3.12, FastAPI, Uvicorn, Pydantic v2 |
| **Database** | MySQL Server 8.0, PyMySQL |
| **ORM** | SQLAlchemy 2.0 |
| **Testing** | Pytest, FastApi TestClient (HTTPX) |

---

## Key Features

- **Executive KPI Cards**: Real-time counts of total listings, cities, industry categories, and source channels.
- **Interactive Visualizations (Recharts)**:
  - **City-wise Bar Chart**: Regional distribution computed via MySQL `GROUP BY city`.
  - **Category-wise Bar Chart**: Industry vertical segmentation via MySQL `GROUP BY category`.
  - **Source-wise Donut Chart**: Channel breakdown via MySQL `GROUP BY source`.
- **Comprehensive Listings Directory**:
  - Live server-side search across business name, address, and phone number.
  - Dropdown filters for City, Category, and Ingestion Source.
  - Server-side pagination with configurable page size (10, 20, 50, 100).
  - One-click copy for phone numbers.
  - Responsive table with loading skeletons, empty states, and error handling.
- **Automated CSV Ingestion**:
  - Ingestion script with duplicate prevention (using composite keys `business_name + city + address`).
  - Pre-populated with **560 verified synthetic records** covering 10 major Indian metropolitan hubs.

---

## Project Structure

```
Business-Listings-Dashboard/
├── backend/
│   ├── tests/
│   │   └── test_api.py            # API unit and integration test suite
│   ├── __init__.py
│   ├── config.py                  # Pydantic Settings & environment variables
│   ├── crud.py                    # Database queries & GROUP BY aggregations
│   ├── database.py                # SQLAlchemy engine & session management
│   ├── import_csv.py              # Duplicate-resistant CSV import script
│   ├── main.py                    # FastAPI application & REST endpoints
│   ├── models.py                  # SQLAlchemy ORM models (listing_master)
│   ├── requirements.txt           # Python dependencies
│   └── schemas.py                 # Pydantic validation schemas
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── CategoryChart.jsx  # Recharts Category Bar Chart
│   │   │   ├── CityChart.jsx      # Recharts City Bar Chart
│   │   │   ├── DatabaseView.jsx   # Schema & table architecture view
│   │   │   ├── Header.jsx         # Dashboard top navigation & status pill
│   │   │   ├── ListingsTable.jsx  # Search, filter, and pagination table
│   │   │   ├── MetricCards.jsx    # Metric KPI summary cards
│   │   │   ├── Sidebar.jsx        # Responsive navigation sidebar
│   │   │   └── SourceChart.jsx    # Recharts Source Donut Chart
│   │   ├── api.js                 # Frontend API client
│   │   ├── App.jsx                # Main dashboard coordinator
│   │   ├── index.css              # Tailwind CSS styles
│   │   └── main.jsx               # React DOM entrypoint
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
├── data/
│   ├── generate_dataset.py        # Reproducible synthetic dataset generator
│   ├── generate_sql_dump.py       # SQL dump exporter
│   └── listings.csv               # 560 synthetic business listing records
├── docs/
│   ├── API_DOCUMENTATION.md       # Complete REST API reference
│   └── ARCHITECTURE.md            # System design and architecture diagram
├── database_dump.sql              # Complete MySQL dump with schema & 560 records
├── PROJECT_STATUS.md              # Project milestones and tracking
├── requirements.txt               # Root Python dependencies
├── .env.example                   # Environment variable template
├── .gitignore                     # Git ignore rules
└── README.md                      # Project manual
```

---

## Synthetic Data Disclosure

> **Transparency Notice**: In strict accordance with the assignment requirements, all 560 records contained in `data/listings.csv` and `database_dump.sql` are **clearly labelled synthetic business records** generated for demonstration, testing, and educational purposes. They are never misrepresented as scraped or genuine third-party commercial data.

---

## Setup & Running Instructions

### 1. Database Configuration
1. Ensure your local **MySQL Server 8.0** is running on port `3306`.
2. Create your `.env` file in the root directory (or in `backend/.env`):
   ```bash
   cp .env.example .env
   ```
3. Set your MySQL credentials in `.env`:
   ```ini
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=business_dashboard
   ```

### 2. Import Data into MySQL
You can populate the database using either the Python import script or the direct SQL dump:

**Option A: Using the Python Importer (Recommended)**
```bash
python backend/import_csv.py
```
*This verifies the schema, imports 560 records, and skips any duplicate records.*

**Option B: Using MySQL CLI Dump**
```bash
mysql -u root -p < database_dump.sql
```

### 3. Run FastAPI Backend
From the project root:
```bash
uvicorn backend.main:app --reload --port 8000
```
- API Base URL: `http://localhost:8000`
- Swagger Interactive Docs: `http://localhost:8000/docs`
- Health Check: `http://localhost:8000/health`

### 4. Run React + Vite Frontend
From the `frontend/` directory:
```bash
cd frontend
npm run dev
```
Open your browser at `http://localhost:5173` to view the live dashboard.

---

## Running Automated Tests

Run backend integration tests:
```bash
pytest backend/tests/test_api.py -v
```

Run frontend production build verification:
```bash
cd frontend
npm run build
```
