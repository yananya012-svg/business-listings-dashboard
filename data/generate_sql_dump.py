"""
Generate database_dump.sql containing the schema and full 560 records.
"""

import csv
import os

def generate_dump():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    csv_path = os.path.join(base_dir, "data", "listings.csv")
    dump_path = os.path.join(base_dir, "database_dump.sql")
    
    with open(csv_path, mode="r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        records = list(reader)
        
    sql_lines = [
        "-- Business Listings Dashboard Database Dump",
        "-- Generated for Internship Assignment",
        "-- Synthetic Dataset of 500+ Verified Records",
        "",
        "CREATE DATABASE IF NOT EXISTS `business_dashboard` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;",
        "USE `business_dashboard`;",
        "",
        "DROP TABLE IF EXISTS `listing_master`;",
        "",
        "CREATE TABLE `listing_master` (",
        "  `id` INT AUTO_INCREMENT PRIMARY KEY,",
        "  `business_name` VARCHAR(255) NOT NULL,",
        "  `category` VARCHAR(100) NOT NULL,",
        "  `city` VARCHAR(100) NOT NULL,",
        "  `address` VARCHAR(500) NOT NULL,",
        "  `phone` VARCHAR(50) DEFAULT NULL,",
        "  `source` VARCHAR(100) NOT NULL,",
        "  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,",
        "  UNIQUE KEY `uniq_listing` (`business_name`, `city`, `address`(191)),",
        "  INDEX `idx_city` (`city`),",
        "  INDEX `idx_category` (`category`),",
        "  INDEX `idx_source` (`source`)",
        ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;",
        "",
        "LOCK TABLES `listing_master` WRITE;",
        "INSERT INTO `listing_master` (`id`, `business_name`, `category`, `city`, `address`, `phone`, `source`, `created_at`) VALUES"
    ]
    
    values_list = []
    for idx, r in enumerate(records, start=1):
        def esc(val):
            if val is None or val == "":
                return "NULL"
            escaped = val.replace("\\", "\\\\").replace("'", "\\'")
            return f"'{escaped}'"
            
        b_name = esc(r["business_name"])
        cat = esc(r["category"])
        city = esc(r["city"])
        addr = esc(r["address"])
        phone = esc(r["phone"])
        source = esc(r["source"])
        created = esc(r["created_at"])
        
        values_list.append(f"({idx}, {b_name}, {cat}, {city}, {addr}, {phone}, {source}, {created})")
        
    sql_lines.append(",\n".join(values_list) + ";")
    sql_lines.append("UNLOCK TABLES;")
    sql_lines.append("")
    
    with open(dump_path, mode="w", encoding="utf-8") as f:
        f.write("\n".join(sql_lines))
        
    print(f"Generated {dump_path} with {len(records)} INSERT rows.")

if __name__ == "__main__":
    generate_dump()
