# Business Listings Dashboard - API Documentation

The backend service is built using **FastAPI** with **SQLAlchemy 2.0** and **Pydantic v2**. All analytics queries utilize optimized MySQL `GROUP BY` aggregations.

Base URL: `http://localhost:8000`

---

## Endpoints

### 1. Health Check
* **Method:** `GET`
* **Path:** `/health`
* **Description:** Verifies application and MySQL database connectivity.
* **Response (200 OK):**
```json
{
  "status": "healthy",
  "database": "connected",
  "timestamp": "2026-11-02T23:30:00.000000"
}
```

---

### 2. Get Listings (Paginated & Filtered)
* **Method:** `GET`
* **Path:** `/api/listings`
* **Query Parameters:**
  - `page` (int, default: 1): Page number starting at 1.
  - `page_size` (int, default: 10, max: 100): Number of items per page.
  - `search` (string, optional): Case-insensitive match on `business_name`, `address`, or `phone`.
  - `city` (string, optional): Exact filter by city name.
  - `category` (string, optional): Exact filter by industry sector.
  - `source` (string, optional): Filter by ingestion channel.
  - `sort_by` (string, default: `created_at`): Sort column (`id`, `business_name`, `category`, `city`, `created_at`).
  - `sort_order` (string, default: `desc`): `asc` or `desc`.
* **Response (200 OK):**
```json
{
  "items": [
    {
      "id": 1,
      "business_name": "Apex CloudScale Technologies",
      "category": "Information Technology",
      "city": "Bengaluru",
      "address": "402, 3rd Floor, Near Whitefield ITPL Road, Whitefield ITPL, Bengaluru",
      "phone": "+91-982134-5678",
      "source": "Synthetic - Directory Sample",
      "created_at": "2026-08-15T10:30:00"
    }
  ],
  "total": 560,
  "page": 1,
  "page_size": 10,
  "total_pages": 56
}
```

---

### 3. Bulk Insert Listings
* **Method:** `POST`
* **Path:** `/api/listings/bulk`
* **Description:** Inserts multiple records in a single transactional batch while skipping duplicate records based on the composite key `(business_name, city, address)`.
* **Request Body:**
```json
{
  "items": [
    {
      "business_name": "Zen Yoga Studio",
      "category": "Fitness & Wellness",
      "city": "Mumbai",
      "address": "12, Ground Floor, Near Bandra East Marg, Bandra East, Mumbai",
      "phone": "+91-998877-6655",
      "source": "Synthetic - Chamber of Commerce"
    }
  ]
}
```
* **Response (201 Created):**
```json
{
  "inserted": 1,
  "skipped": 0,
  "total_processed": 1
}
```

---

### 4. High-Level Summary Analytics
* **Method:** `GET`
* **Path:** `/api/analytics/summary`
* **Description:** Aggregates total counts across entities for dashboard metric cards.
* **Response (200 OK):**
```json
{
  "total_listings": 560,
  "total_cities": 10,
  "total_categories": 10,
  "total_sources": 5
}
```

---

### 5. City-Wise Analytics
* **Method:** `GET`
* **Path:** `/api/analytics/city`
* **Description:** Groups listings by city using `GROUP BY city ORDER BY count DESC`.
* **Response (200 OK):**
```json
[
  { "city": "Bengaluru", "count": 64 },
  { "city": "Mumbai", "count": 62 },
  { "city": "Delhi", "count": 59 }
]
```

---

### 6. Category-Wise Analytics
* **Method:** `GET`
* **Path:** `/api/analytics/category`
* **Description:** Groups listings by category vertical using `GROUP BY category ORDER BY count DESC`.
* **Response (200 OK):**
```json
[
  { "category": "Information Technology", "count": 62 },
  { "category": "Healthcare & Clinics", "count": 59 },
  { "category": "Financial Services", "count": 58 }
]
```

---

### 7. Source-Wise Analytics
* **Method:** `GET`
* **Path:** `/api/analytics/source`
* **Description:** Groups listings by ingestion source channel using `GROUP BY source ORDER BY count DESC`.
* **Response (200 OK):**
```json
[
  { "source": "Synthetic - Directory Sample", "count": 122 },
  { "source": "Synthetic - Business Portal", "count": 118 },
  { "source": "Synthetic - Trade Registry", "count": 112 }
]
```

---

### 8. Filter Options Lookup
* **Method:** `GET`
* **Path:** `/api/filter-options`
* **Description:** Returns sorted distinct lists of available cities, categories, and sources for UI dropdowns.
* **Response (200 OK):**
```json
{
  "cities": ["Ahmedabad", "Bengaluru", "Chennai", "Delhi", "Hyderabad", "Jaipur", "Kochi", "Kolkata", "Mumbai", "Pune"],
  "categories": ["Automobile Services", "Education & Coaching", "Financial Services", "Fitness & Wellness", "Healthcare & Clinics", "Hospitality & Hotels", "Information Technology", "Real Estate & Construction", "Restaurants & Cafes", "Retail & Supermarkets"],
  "sources": ["Synthetic - Business Portal", "Synthetic - Chamber of Commerce", "Synthetic - Directory Sample", "Synthetic - Trade Registry", "Synthetic - YellowPages Sample"]
}
```
