from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, Index
from .database import Base

class ListingMaster(Base):
    __tablename__ = "listing_master"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    business_name = Column(String(255), nullable=False, index=True)
    category = Column(String(100), nullable=False, index=True)
    city = Column(String(100), nullable=False, index=True)
    address = Column(String(500), nullable=False)
    phone = Column(String(50), nullable=True)
    source = Column(String(100), nullable=False, index=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    __table_args__ = (
        Index(
            "uniq_listing",
            "business_name",
            "city",
            "address",
            unique=True,
            mysql_length={"business_name": 150, "city": 100, "address": 150}
        ),
        Index("idx_city_cat", "city", "category"),
    )

    def to_dict(self):
        return {
            "id": self.id,
            "business_name": self.business_name,
            "category": self.category,
            "city": self.city,
            "address": self.address,
            "phone": self.phone,
            "source": self.source,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }
