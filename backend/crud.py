from typing import Optional, List, Tuple
from sqlalchemy.orm import Session
from sqlalchemy import func, or_, desc, asc
from .models import ListingMaster
from .schemas import (
    ListingCreate,
    AnalyticsSummaryResponse,
    CityAnalyticsItem,
    CategoryAnalyticsItem,
    SourceAnalyticsItem,
    FilterOptionsResponse
)

def get_listings(
    db: Session,
    page: int = 1,
    page_size: int = 10,
    search: Optional[str] = None,
    city: Optional[str] = None,
    category: Optional[str] = None,
    source: Optional[str] = None,
    sort_by: str = "created_at",
    sort_order: str = "desc"
) -> Tuple[List[ListingMaster], int]:
    query = db.query(ListingMaster)

    # Filter by search string across business_name, address, or phone
    if search:
        search_term = f"%{search.strip()}%"
        query = query.filter(
            or_(
                ListingMaster.business_name.ilike(search_term),
                ListingMaster.address.ilike(search_term),
                ListingMaster.phone.ilike(search_term)
            )
        )

    # Filter by city
    if city and city.strip():
        query = query.filter(ListingMaster.city == city.strip())

    # Filter by category
    if category and category.strip():
        query = query.filter(ListingMaster.category == category.strip())

    # Filter by source
    if source and source.strip():
        query = query.filter(ListingMaster.source == source.strip())

    total = query.count()

    # Determine sorting column
    sort_col = getattr(ListingMaster, sort_by, ListingMaster.created_at)
    if sort_order.lower() == "asc":
        query = query.order_by(asc(sort_col))
    else:
        query = query.order_by(desc(sort_col))

    offset = (page - 1) * page_size
    items = query.offset(offset).limit(page_size).all()

    return items, total

def bulk_create_listings(db: Session, listings: List[ListingCreate]) -> dict:
    inserted_count = 0
    skipped_count = 0

    # Build a set of existing (business_name, city, address) keys
    existing_records = db.query(
        ListingMaster.business_name,
        ListingMaster.city,
        ListingMaster.address
    ).all()
    
    seen_keys = {
        (rec[0].lower().strip(), rec[1].lower().strip(), rec[2].lower().strip())
        for rec in existing_records
    }

    new_objects = []
    for item in listings:
        key = (item.business_name.lower().strip(), item.city.lower().strip(), item.address.lower().strip())
        if key in seen_keys:
            skipped_count += 1
            continue

        seen_keys.add(key)
        new_objects.append(
            ListingMaster(
                business_name=item.business_name.strip(),
                category=item.category.strip(),
                city=item.city.strip(),
                address=item.address.strip(),
                phone=item.phone.strip() if item.phone else None,
                source=item.source.strip(),
                created_at=item.created_at
            )
        )
        inserted_count += 1

    if new_objects:
        db.bulk_save_objects(new_objects)
        db.commit()

    return {
        "inserted": inserted_count,
        "skipped": skipped_count,
        "total_processed": len(listings)
    }

def get_analytics_summary(db: Session) -> AnalyticsSummaryResponse:
    total_listings = db.query(func.count(ListingMaster.id)).scalar() or 0
    total_cities = db.query(func.count(func.distinct(ListingMaster.city))).scalar() or 0
    total_categories = db.query(func.count(func.distinct(ListingMaster.category))).scalar() or 0
    total_sources = db.query(func.count(func.distinct(ListingMaster.source))).scalar() or 0

    return AnalyticsSummaryResponse(
        total_listings=total_listings,
        total_cities=total_cities,
        total_categories=total_categories,
        total_sources=total_sources
    )

def get_analytics_by_city(db: Session) -> List[CityAnalyticsItem]:
    # Requirement: MySQL queries using GROUP BY
    results = (
        db.query(ListingMaster.city, func.count(ListingMaster.id).label("count"))
        .group_by(ListingMaster.city)
        .order_by(desc("count"))
        .all()
    )
    return [CityAnalyticsItem(city=row[0], count=row[1]) for row in results]

def get_analytics_by_category(db: Session) -> List[CategoryAnalyticsItem]:
    # Requirement: MySQL queries using GROUP BY
    results = (
        db.query(ListingMaster.category, func.count(ListingMaster.id).label("count"))
        .group_by(ListingMaster.category)
        .order_by(desc("count"))
        .all()
    )
    return [CategoryAnalyticsItem(category=row[0], count=row[1]) for row in results]

def get_analytics_by_source(db: Session) -> List[SourceAnalyticsItem]:
    # Requirement: MySQL queries using GROUP BY
    results = (
        db.query(ListingMaster.source, func.count(ListingMaster.id).label("count"))
        .group_by(ListingMaster.source)
        .order_by(desc("count"))
        .all()
    )
    return [SourceAnalyticsItem(source=row[0], count=row[1]) for row in results]

def get_filter_options(db: Session) -> FilterOptionsResponse:
    cities = [r[0] for r in db.query(ListingMaster.city).distinct().order_by(ListingMaster.city).all() if r[0]]
    categories = [r[0] for r in db.query(ListingMaster.category).distinct().order_by(ListingMaster.category).all() if r[0]]
    sources = [r[0] for r in db.query(ListingMaster.source).distinct().order_by(ListingMaster.source).all() if r[0]]
    return FilterOptionsResponse(cities=cities, categories=categories, sources=sources)
