import math
from datetime import datetime, timezone
from typing import Optional, List
from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends, Query, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text

from .config import settings
from .database import get_db, init_database
from .schemas import (
    ListingResponse,
    ListingPaginationResponse,
    BulkCreateRequest,
    BulkCreateResponse,
    AnalyticsSummaryResponse,
    CityAnalyticsItem,
    CategoryAnalyticsItem,
    SourceAnalyticsItem,
    FilterOptionsResponse
)
from . import crud

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Ensure the MySQL schema and table exist on application startup.
    """
    try:
        init_database()
        print("Database schema verified on startup.")
    except Exception as e:
        print(f"Warning during database initialization: {e}")
    yield

app = FastAPI(
    title="Business Listings Dashboard API",
    description="High-performance backend API for business listing exploration and real-time analytics",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list or ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health", tags=["Health"])
def health_check(db: Session = Depends(get_db)):
    """
    Health check endpoint returning system status and MySQL connectivity.
    """
    db_status = "connected"
    try:
        db.execute(text("SELECT 1"))
    except Exception as e:
        db_status = f"unreachable: {str(e)}"

    return {
        "status": "healthy" if db_status == "connected" else "degraded",
        "database": db_status,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }

@app.get("/api/listings", response_model=ListingPaginationResponse, tags=["Listings"])
def get_listings(
    page: int = Query(1, ge=1, description="Page number starting at 1"),
    page_size: int = Query(10, ge=1, le=100, description="Items per page"),
    search: Optional[str] = Query(None, description="Search keyword for name, address, or phone"),
    city: Optional[str] = Query(None, description="Filter by city"),
    category: Optional[str] = Query(None, description="Filter by category"),
    source: Optional[str] = Query(None, description="Filter by source"),
    sort_by: str = Query("created_at", description="Field to sort by (created_at, business_name, city, category, id)"),
    sort_order: str = Query("desc", pattern="^(asc|desc)$", description="Sort order: asc or desc"),
    db: Session = Depends(get_db)
):
    """
    Fetch paginated business listings with optional full-text search, filtering, and sorting.
    """
    valid_sort_fields = {"id", "business_name", "category", "city", "created_at"}
    if sort_by not in valid_sort_fields:
        sort_by = "created_at"

    items, total = crud.get_listings(
        db=db,
        page=page,
        page_size=page_size,
        search=search,
        city=city,
        category=category,
        source=source,
        sort_by=sort_by,
        sort_order=sort_order
    )

    total_pages = math.ceil(total / page_size) if total > 0 else 1

    return ListingPaginationResponse(
        items=items,
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages
    )

@app.post("/api/listings/bulk", response_model=BulkCreateResponse, status_code=status.HTTP_201_CREATED, tags=["Listings"])
def bulk_create_listings(payload: BulkCreateRequest, db: Session = Depends(get_db)):
    """
    Bulk insert multiple listings into MySQL while avoiding duplicate records.
    """
    try:
        result = crud.bulk_create_listings(db=db, listings=payload.items)
        return BulkCreateResponse(**result)
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to process bulk insert: {str(e)}"
        )

@app.get("/api/analytics/summary", response_model=AnalyticsSummaryResponse, tags=["Analytics"])
def get_analytics_summary(db: Session = Depends(get_db)):
    """
    Return high-level summary metrics: total listings, distinct cities, categories, and sources.
    """
    return crud.get_analytics_summary(db=db)

@app.get("/api/analytics/city", response_model=List[CityAnalyticsItem], tags=["Analytics"])
def get_analytics_by_city(db: Session = Depends(get_db)):
    """
    Return city-wise listing distribution using MySQL GROUP BY queries.
    """
    return crud.get_analytics_by_city(db=db)

@app.get("/api/analytics/category", response_model=List[CategoryAnalyticsItem], tags=["Analytics"])
def get_analytics_by_category(db: Session = Depends(get_db)):
    """
    Return category-wise listing distribution using MySQL GROUP BY queries.
    """
    return crud.get_analytics_by_category(db=db)

@app.get("/api/analytics/source", response_model=List[SourceAnalyticsItem], tags=["Analytics"])
def get_analytics_by_source(db: Session = Depends(get_db)):
    """
    Return source-wise listing distribution using MySQL GROUP BY queries.
    """
    return crud.get_analytics_by_source(db=db)

@app.get("/api/filter-options", response_model=FilterOptionsResponse, tags=["Listings"])
def get_filter_options(db: Session = Depends(get_db)):
    """
    Return distinct list of cities, categories, and sources to populate UI filter dropdowns.
    """
    return crud.get_filter_options(db=db)
