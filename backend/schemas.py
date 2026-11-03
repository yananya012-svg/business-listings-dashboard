from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field, ConfigDict

class ListingBase(BaseModel):
    business_name: str = Field(..., min_length=1, max_length=255, description="Name of the business entity")
    category: str = Field(..., min_length=1, max_length=100, description="Business vertical / industry category")
    city: str = Field(..., min_length=1, max_length=100, description="City location")
    address: str = Field(..., min_length=1, max_length=500, description="Detailed physical address")
    phone: Optional[str] = Field(None, max_length=50, description="Contact phone number (nullable)")
    source: str = Field(..., min_length=1, max_length=100, description="Source of the listing record")

class ListingCreate(ListingBase):
    created_at: Optional[datetime] = Field(None, description="Creation timestamp")

class ListingResponse(ListingBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class ListingPaginationResponse(BaseModel):
    items: List[ListingResponse]
    total: int
    page: int
    page_size: int
    total_pages: int

class BulkCreateRequest(BaseModel):
    items: List[ListingCreate] = Field(..., min_length=1, description="List of listings to import")

class BulkCreateResponse(BaseModel):
    inserted: int
    skipped: int
    total_processed: int

class AnalyticsSummaryResponse(BaseModel):
    total_listings: int
    total_cities: int
    total_categories: int
    total_sources: int

class CityAnalyticsItem(BaseModel):
    city: str
    count: int

class CategoryAnalyticsItem(BaseModel):
    category: str
    count: int

class SourceAnalyticsItem(BaseModel):
    source: str
    count: int

class FilterOptionsResponse(BaseModel):
    cities: List[str]
    categories: List[str]
    sources: List[str]
