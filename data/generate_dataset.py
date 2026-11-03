"""
Script to generate at least 550 realistic, high-quality synthetic business records.
NOTE: These records are strictly synthetic/sample records generated for educational
and demonstration purposes in this internship assignment. They are never misrepresented
as scraped data.
"""

import csv
import random
import os
from datetime import datetime, timedelta

# Seed for deterministic and reproducible dataset
random.seed(42)

CITIES = [
    "Mumbai", "Delhi", "Bengaluru", "Hyderabad", "Chennai",
    "Kolkata", "Pune", "Ahmedabad", "Jaipur", "Kochi"
]

CATEGORIES = [
    "Information Technology",
    "Healthcare & Clinics",
    "Restaurants & Cafes",
    "Retail & Supermarkets",
    "Financial Services",
    "Education & Coaching",
    "Automobile Services",
    "Real Estate & Construction",
    "Hospitality & Hotels",
    "Fitness & Wellness"
]

SOURCES = [
    "Synthetic - Directory Sample",
    "Synthetic - Trade Registry",
    "Synthetic - Business Portal",
    "Synthetic - YellowPages Sample",
    "Synthetic - Chamber of Commerce"
]

NAME_PREFIXES = {
    "Information Technology": ["Apex", "NexGen", "CloudScale", "CodeCraft", "Infotech", "CyberSphere", "AlgoLogic", "DataPulse", "VirtuTech", "Quantum"],
    "Healthcare & Clinics": ["LifeCare", "HealthFirst", "ApolloCare", "MetroHealth", "Wellness", "CarePlus", "Pulse", "CureWell", "HealMed", "Vitality"],
    "Restaurants & Cafes": ["The Golden", "Urban", "Spice", "Cafe", "Bistro", "The Royal", "Taste of", "Chai &", "Green Leaf", "Flavors of"],
    "Retail & Supermarkets": ["MegaMart", "QuickBuy", "DailyNeeds", "Metro Supermarket", "ValuePlus", "FreshBazaar", "Prime Store", "CityMart", "SuperSaver", "Corner"],
    "Financial Services": ["WealthBridge", "CapitalTrust", "FinServe", "PrimeFin", "GrowMore", "SecureInvest", "EquiWealth", "FinEdge", "SmartMoney", "TrustAdvisors"],
    "Education & Coaching": ["BrightFuture", "Excel Academy", "LearnWise", "Apex Tutorials", "Vidya Mandir", "EduGlobal", "Scholars Hub", "CareerPath", "Pinnacle Classes", "GuruKrupa"],
    "Automobile Services": ["Speedy Wheels", "AutoCare", "Precision Motors", "DriveWell", "AutoFix Hub", "Elite Car Spa", "MotorWorks", "WheelZone", "FastTrack Auto", "ProService Garage"],
    "Real Estate & Construction": ["Skyline Realty", "UrbanBuild", "Prime Properties", "Heritage Homes", "Brick & Mortar", "BlueStone Infra", "Apex Estates", "Metro Living", "Landmark Developers", "Vista Housing"],
    "Hospitality & Hotels": ["Grand Palace", "Royal Orchid", "The Serene", "Comfort Inn", "Sunset Suites", "Heritage Haven", "Majestic Residency", "The Palm", "City Vista", "Elite Stay"],
    "Fitness & Wellness": ["IronFit Gym", "PowerPulse", "FlexZone", "Zen Yoga Studio", "FitLife Club", "PureSoul Spa", "ActiveLife Center", "CoreStrength", "Revive Wellness", "BodyWorks"]
}

NAME_SUFFIXES = {
    "Information Technology": ["Solutions", "Technologies", "Labs", "Systems", "Software", "Digital", "Consulting", "Innovations"],
    "Healthcare & Clinics": ["Clinic", "Diagnostic Center", "Hospital", "Polyclinic", "Care Center", "Specialty Clinic", "Medical Care"],
    "Restaurants & Cafes": ["Kitchen", "Dine", "Bistro", "Cafe", "Grill", "Treats", "Lounge", "Eatery", "Express"],
    "Retail & Supermarkets": ["Store", "Supermarket", "Hypermarket", "Bazaar", "Retails", "Mart", "Emporium"],
    "Financial Services": ["Consultants", "Advisors", "Capital", "Wealth Management", "Finance", "Investments", "Associates"],
    "Education & Coaching": ["Institute", "Academy", "Classes", "Learning Hub", "Center", "Tutorials", "Foundation"],
    "Automobile Services": ["Garage", "Motors", "Auto Service", "Car Care", "Workstation", "Repairs"],
    "Real Estate & Construction": ["Realty", "Properties", "Builders", "Infrastructure", "Estates", "Developers"],
    "Hospitality & Hotels": ["Hotel & Suites", "Residency", "Resort", "Inn", "Boutique Stay", "Grand Hotel"],
    "Fitness & Wellness": ["Gym & Fitness", "Yoga Hub", "Wellness Spa", "Fitness Studio", "Crossfit Center", "Club"]
}

STREET_TYPES = ["Road", "Marg", "Street", "Avenue", "Lane", "Nagar", "Sector", "Complex", "Circle", "Plaza"]
LOCALITIES = {
    "Mumbai": ["Andheri West", "Bandra East", "Nariman Point", "Powai", "Lower Parel", "Borivali", "Dadar", "Thane West", "Malad Mindspace", "Worli"],
    "Delhi": ["Connaught Place", "Saket", "Nehru Place", "Dwarka Sector 12", "Karol Bagh", "South Extension", "Lajpat Nagar", "Rohini Sector 7", "Hauz Khas", "Okhla Phase 3"],
    "Bengaluru": ["Indiranagar", "Koramangala 4th Block", "Whitefield ITPL", "HSR Layout Sector 1", "Electronic City Phase 1", "Jayanagar 4th Block", "MG Road", "Hebbal", "BTM Layout", "Marathahalli"],
    "Hyderabad": ["Hitec City", "Madhapur", "Banjara Hills Road 12", "Gachibowli", "Jubilee Hills", "Kondapur", "Begumpet", "Ameerpet", "Secunderabad", "Kukatpally"],
    "Chennai": ["T. Nagar", "Anna Nagar", "Adyar", "Velachery", "OMR IT Corridor", "Nungambakkam", "Mylapore", "Guindy", "Alwarpet", "Besant Nagar"],
    "Kolkata": ["Salt Lake Sector V", "Park Street", "New Town Action Area 1", "Ballygunge", "Gariahat", "Howrah Station Road", "Rajarhat", "Camac Street", "Behala", "Dum Dum"],
    "Pune": ["Hinjewadi Phase 1", "Koregaon Park", "Viman Nagar", "Kothrud", "Baner Road", "Aundh", "Shivajinagar", "Magarpatta City", "Hadapsar", "FC Road"],
    "Ahmedabad": ["SG Highway", "Navrangpura", "Prahlad Nagar", "Vastrapur", "Bodakdev", "Ashram Road", "Satellite", "Maninagar", "Ellisbridge", "Sindhu Bhavan Road"],
    "Jaipur": ["Malviya Nagar", "C-Scheme", "Vaishali Nagar", "Mansarovar", "MI Road", "Raja Park", "Tonk Road", "Civil Lines", "Jagatpura", "Sitapura"],
    "Kochi": ["MG Road", "Marine Drive", "Kaloor", "Edappally", "Kakkanad InfoPark", "Fort Kochi", "Panampilly Nagar", "Palarivattom", "Vyttila", "Aluva"]
}

def generate_phone(allow_null=True):
    # Requirement: phone is nullable
    if allow_null and random.random() < 0.08:
        return ""
    prefix = random.choice(["98", "99", "97", "96", "95", "93", "91", "88", "80", "70"])
    rest = "".join([str(random.randint(0, 9)) for _ in range(8)])
    return f"+91-{prefix}{rest[:4]}-{rest[4:]}"

def generate_record(index):
    category = random.choice(CATEGORIES)
    city = random.choice(CITIES)
    source = random.choice(SOURCES)
    
    prefix = random.choice(NAME_PREFIXES[category])
    suffix = random.choice(NAME_SUFFIXES[category])
    
    # Adding specific variation to ensure names are distinct and meaningful
    variant_word = random.choice(["Global", "Metro", "Elite", "Prime", "Royal", "Nova", "Central", "Star", "First", "Universal", "Summit", "Vanguard", ""])
    if variant_word and random.random() < 0.4:
        business_name = f"{prefix} {variant_word} {suffix}"
    else:
        business_name = f"{prefix} {suffix}"

    locality = random.choice(LOCALITIES[city])
    plot_num = random.randint(1, 999)
    floor = random.choice(["Ground Floor", "1st Floor", "2nd Floor", "3rd Floor", "4th Floor", "Suite 201", "Office 405", "Tower B", "Shop #12"])
    street = random.choice(STREET_TYPES)
    address = f"{plot_num}, {floor}, Near {locality} {street}, {locality}, {city}"
    
    phone = generate_phone()
    
    # Random date within the last 18 months
    days_ago = random.randint(1, 540)
    minutes_offset = random.randint(0, 1440)
    created_at = (datetime.now() - timedelta(days=days_ago, minutes=minutes_offset)).strftime("%Y-%m-%d %H:%M:%S")

    return {
        "business_name": business_name,
        "category": category,
        "city": city,
        "address": address,
        "phone": phone,
        "source": source,
        "created_at": created_at
    }

def main():
    target_count = 560 # Exceeds required 500
    seen = set()
    records = []
    
    attempts = 0
    while len(records) < target_count and attempts < 10000:
        attempts += 1
        rec = generate_record(len(records) + 1)
        # Check uniqueness by (business_name, city, address)
        key = (rec["business_name"].lower(), rec["city"].lower(), rec["address"].lower())
        if key in seen:
            continue
        seen.add(key)
        records.append(rec)
        
    out_dir = os.path.dirname(os.path.abspath(__file__))
    csv_path = os.path.join(out_dir, "listings.csv")
    
    fieldnames = ["business_name", "category", "city", "address", "phone", "source", "created_at"]
    
    with open(csv_path, mode="w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        for r in records:
            writer.writerow(r)
            
    print(f"Successfully generated {len(records)} unique synthetic business records in: {csv_path}")

if __name__ == "__main__":
    main()
