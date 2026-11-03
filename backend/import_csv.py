"""
CSV Import Script for Business Listings Dashboard.
Imports listings from a CSV file into MySQL while avoiding duplicate records.
"""

import sys
import os
import csv
from datetime import datetime
from pathlib import Path

# Add project root to sys.path so backend modules can be imported
PROJECT_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(PROJECT_ROOT))

from backend.config import settings
from backend.database import SessionLocal, init_database
from backend.models import ListingMaster
from backend.schemas import ListingCreate
from backend.crud import bulk_create_listings

def parse_date(date_str: str):
    if not date_str:
        return datetime.utcnow()
    try:
        return datetime.strptime(date_str.strip(), "%Y-%m-%d %H:%M:%S")
    except Exception:
        try:
            return datetime.fromisoformat(date_str.strip())
        except Exception:
            return datetime.utcnow()

def import_csv(csv_path: str = None):
    if csv_path is None:
        csv_path = PROJECT_ROOT / "data" / "listings.csv"
    else:
        csv_path = Path(csv_path)

    if not csv_path.exists():
        print(f"Error: CSV file not found at: {csv_path}")
        return False

    print(f"Connecting to MySQL database '{settings.DB_NAME}' on {settings.DB_HOST}:{settings.DB_PORT}...")
    try:
        init_database()
        print("Database schema verified.")
    except Exception as e:
        print(f"Database connection error: {e}")
        return False

    print(f"Reading CSV from: {csv_path}...")
    records_to_insert = []
    with open(csv_path, mode="r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            b_name = row.get("business_name", "").strip()
            cat = row.get("category", "").strip()
            city = row.get("city", "").strip()
            addr = row.get("address", "").strip()
            phone = row.get("phone", "").strip() or None
            src = row.get("source", "").strip()
            created_at_dt = parse_date(row.get("created_at"))

            if not b_name or not cat or not city or not addr or not src:
                continue

            records_to_insert.append(
                ListingCreate(
                    business_name=b_name,
                    category=cat,
                    city=city,
                    address=addr,
                    phone=phone,
                    source=src,
                    created_at=created_at_dt
                )
            )

    print(f"Found {len(records_to_insert)} records in CSV.")
    db = SessionLocal()
    try:
        result = bulk_create_listings(db=db, listings=records_to_insert)
        print("=" * 50)
        print("IMPORT COMPLETED SUCCESSFULLY!")
        print(f"Total Processed : {result['total_processed']}")
        print(f"Newly Inserted  : {result['inserted']}")
        print(f"Skipped Dups    : {result['skipped']}")
        print("=" * 50)
        return True
    except Exception as e:
        db.rollback()
        print(f"Failed to import records: {e}")
        return False
    finally:
        db.close()

if __name__ == "__main__":
    target_csv = sys.argv[1] if len(sys.argv) > 1 else None
    success = import_csv(target_csv)
    sys.exit(0 if success else 1)
