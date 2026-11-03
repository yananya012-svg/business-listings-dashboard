import pytest
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_health():
    """Verify health endpoint and active MySQL connectivity"""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["database"] == "connected"
    assert "timestamp" in data

def test_api_analytics_summary():
    """Verify summary metrics match our loaded database"""
    response = client.get("/api/analytics/summary")
    assert response.status_code == 200
    data = response.json()
    assert data["total_listings"] >= 500
    assert data["total_cities"] >= 10
    assert data["total_categories"] >= 10
    assert data["total_sources"] >= 3

def test_api_analytics_city():
    """Verify city-wise grouping and GROUP BY aggregation"""
    response = client.get("/api/analytics/city")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 10
    for item in data:
        assert "city" in item
        assert "count" in item
        assert item["count"] > 0

def test_api_analytics_category():
    """Verify category-wise grouping and GROUP BY aggregation"""
    response = client.get("/api/analytics/category")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 10
    for item in data:
        assert "category" in item
        assert "count" in item
        assert item["count"] > 0

def test_api_analytics_source():
    """Verify source-wise grouping and GROUP BY aggregation"""
    response = client.get("/api/analytics/source")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 3
    for item in data:
        assert "source" in item
        assert "count" in item
        assert item["count"] > 0

def test_api_filter_options():
    """Verify filter options endpoint returns lists for dropdowns"""
    response = client.get("/api/filter-options")
    assert response.status_code == 200
    data = response.json()
    assert len(data["cities"]) >= 10
    assert len(data["categories"]) >= 10
    assert len(data["sources"]) >= 3

def test_api_listings_pagination():
    """Verify paginated listings fetch"""
    response = client.get("/api/listings?page=1&page_size=15")
    assert response.status_code == 200
    data = response.json()
    assert len(data["items"]) == 15
    assert data["total"] >= 500
    assert data["page"] == 1
    assert data["page_size"] == 15
    assert data["total_pages"] >= 30

def test_api_listings_search():
    """Verify search filter across records"""
    response = client.get("/api/listings?search=Hospital")
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    for item in data["items"]:
        match = (
            "hospital" in item["business_name"].lower()
            or "hospital" in item["address"].lower()
            or "hospital" in item["category"].lower()
        )
        assert match

def test_api_listings_city_filter():
    """Verify exact city filtering"""
    response = client.get("/api/listings?city=Mumbai")
    assert response.status_code == 200
    data = response.json()
    assert len(data["items"]) > 0
    for item in data["items"]:
        assert item["city"] == "Mumbai"

def test_api_listings_category_filter():
    """Verify exact category filtering"""
    response = client.get("/api/listings?category=Information%20Technology")
    assert response.status_code == 200
    data = response.json()
    assert len(data["items"]) > 0
    for item in data["items"]:
        assert item["category"] == "Information Technology"

def test_bulk_create_endpoint_and_deduplication():
    """Verify bulk insert endpoint and duplicate skipping"""
    # Inserting duplicate of existing item
    payload = {
        "items": [
            {
                "business_name": "Test Enterprise Verification",
                "category": "Information Technology",
                "city": "Bengaluru",
                "address": "999 Tech Park Test Lane, Bengaluru",
                "phone": "+91-99999-99999",
                "source": "Synthetic - Test Verification"
            }
        ]
    }
    # First insert
    res1 = client.post("/api/listings/bulk", json=payload)
    assert res1.status_code == 201
    d1 = res1.json()
    # It will either insert 1 (first time) or skip 1 (if run again)
    assert d1["total_processed"] == 1

    # Second insert of identical record
    res2 = client.post("/api/listings/bulk", json=payload)
    assert res2.status_code == 201
    d2 = res2.json()
    assert d2["inserted"] == 0
    assert d2["skipped"] == 1
