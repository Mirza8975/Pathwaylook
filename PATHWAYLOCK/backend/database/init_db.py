"""
Database initialization script
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from models.database import Base
from database.connection import engine
from datetime import datetime, timedelta

def init_db():
    """Create all database tables"""
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully!")

    # Load initial data
    print("Loading initial data...")
    load_opportunities()
    load_coverage()
    load_nsqf_pathways()
    print("Initial data loaded successfully!")

def load_opportunities():
    """Load prototype opportunities"""
    from sqlalchemy.orm import Session
    from models.database import Opportunity

    db = Session(bind=engine)

    # Check if data already exists
    if db.query(Opportunity).count() > 0:
        print("Opportunities already loaded, skipping...")
        db.close()
        return

    opportunities = [
        {
            "title": "Tailoring Assistant",
            "occupation": "Tailoring",
            "location": "Dharavi, Mumbai",
            "distance_km": 2.8,
            "employment_type": "full-time",
            "required_skills": ["stitching", "basic tailoring", "measurements"],
            "qualification": "10th Pass",
            "source": "Local Garment Cooperative Survey",
            "source_type": "FIELD_VERIFIED",
            "last_verified_at": datetime.utcnow() - timedelta(days=12),
            "verification_status": "COUNSELLOR_VERIFIED",
            "confidence": 0.92,
            "description": "Assist in garment stitching and alteration work at local cooperative"
        },
        {
            "title": "Embroidery Worker",
            "occupation": "Embroidery",
            "location": "Kurla, Mumbai",
            "distance_km": 4.2,
            "employment_type": "flexible",
            "required_skills": ["hand embroidery", "thread work", "design basics"],
            "qualification": "8th Pass",
            "source": "Handicraft Center Directory",
            "source_type": "PUBLIC_SOURCE",
            "last_verified_at": datetime.utcnow() - timedelta(days=95),
            "verification_status": "UNVERIFIED",
            "confidence": 0.68,
            "description": "Home-based or center-based embroidery work for textile products"
        },
        {
            "title": "Beauty Assistant",
            "occupation": "Beauty Services",
            "location": "Bandra, Mumbai",
            "distance_km": 5.5,
            "employment_type": "part-time",
            "required_skills": ["hair care", "basic makeup", "customer service"],
            "qualification": "12th Pass",
            "source": "Beauty Salon Network",
            "source_type": "SAMPLE_DATA",
            "last_verified_at": datetime.utcnow() - timedelta(days=45),
            "verification_status": "UNVERIFIED",
            "confidence": 0.71,
            "description": "Assist in beauty salon services including hair and makeup"
        },
        {
            "title": "Data Entry Operator",
            "occupation": "Data Entry",
            "location": "Andheri, Mumbai",
            "distance_km": 8.3,
            "employment_type": "full-time",
            "required_skills": ["computer basics", "typing", "MS Office"],
            "qualification": "12th Pass",
            "source": "Job Portal Listings",
            "source_type": "PUBLIC_SOURCE",
            "last_verified_at": datetime.utcnow() - timedelta(days=20),
            "verification_status": "UNVERIFIED",
            "confidence": 0.75,
            "description": "Data entry work in office environment"
        },
        {
            "title": "Handicraft Artisan",
            "occupation": "Handicraft",
            "location": "Borivali, Mumbai",
            "distance_km": 3.5,
            "employment_type": "self-employment",
            "required_skills": ["craft making", "traditional art", "design"],
            "qualification": "Any",
            "source": "Artisan Cooperative",
            "source_type": "FIELD_VERIFIED",
            "last_verified_at": datetime.utcnow() - timedelta(days=8),
            "verification_status": "COUNSELLOR_VERIFIED",
            "confidence": 0.88,
            "description": "Create and sell handicraft items through cooperative"
        },
        {
            "title": "Tailoring Instructor Assistant",
            "occupation": "Tailoring",
            "location": "Malad, Mumbai",
            "distance_km": 6.1,
            "employment_type": "part-time",
            "required_skills": ["advanced tailoring", "teaching", "pattern making"],
            "qualification": "12th Pass",
            "source": "Skill Training Center",
            "source_type": "FIELD_VERIFIED",
            "last_verified_at": datetime.utcnow() - timedelta(days=5),
            "verification_status": "COUNSELLOR_VERIFIED",
            "confidence": 0.90,
            "description": "Assist in teaching tailoring courses at training center"
        },
        {
            "title": "Retail Assistant",
            "occupation": "Retail",
            "location": "Goregaon, Mumbai",
            "distance_km": 7.8,
            "employment_type": "full-time",
            "required_skills": ["customer service", "billing", "inventory"],
            "qualification": "10th Pass",
            "source": "Retail Chain Survey",
            "source_type": "PUBLIC_SOURCE",
            "last_verified_at": datetime.utcnow() - timedelta(days=60),
            "verification_status": "UNVERIFIED",
            "confidence": 0.72,
            "description": "Work in retail store handling customers and inventory"
        },
        {
            "title": "Home-based Stitching",
            "occupation": "Tailoring",
            "location": "Santacruz, Mumbai",
            "distance_km": 1.9,
            "employment_type": "flexible",
            "required_skills": ["stitching", "basic tailoring"],
            "qualification": "Any",
            "source": "Self-Employment Network",
            "source_type": "FIELD_VERIFIED",
            "last_verified_at": datetime.utcnow() - timedelta(days=15),
            "verification_status": "COUNSELLOR_VERIFIED",
            "confidence": 0.85,
            "description": "Work from home on piece-rate stitching assignments"
        }
    ]

    for opp_data in opportunities:
        opportunity = Opportunity(**opp_data)
        db.add(opportunity)

    db.commit()
    print(f"Loaded {len(opportunities)} opportunities")
    db.close()

def load_coverage():
    """Load coverage status data"""
    from sqlalchemy.orm import Session
    from models.database import Coverage

    db = Session(bind=engine)

    # Check if data already exists
    if db.query(Coverage).count() > 0:
        print("Coverage data already loaded, skipping...")
        db.close()
        return

    coverage_data = [
        {
            "occupation": "Tailoring",
            "location": "Mumbai",
            "status": "SEARCHED_FOUND",
            "last_searched_at": datetime.utcnow() - timedelta(days=5),
            "opportunities_count": 3
        },
        {
            "occupation": "Embroidery",
            "location": "Mumbai",
            "status": "SEARCHED_FOUND",
            "last_searched_at": datetime.utcnow() - timedelta(days=95),
            "opportunities_count": 1
        },
        {
            "occupation": "Beauty Services",
            "location": "Mumbai",
            "status": "SEARCHED_FOUND",
            "last_searched_at": datetime.utcnow() - timedelta(days=45),
            "opportunities_count": 1
        },
        {
            "occupation": "Data Entry",
            "location": "Mumbai",
            "status": "SEARCHED_FOUND",
            "last_searched_at": datetime.utcnow() - timedelta(days=20),
            "opportunities_count": 1
        },
        {
            "occupation": "Handicraft",
            "location": "Mumbai",
            "status": "SEARCHED_FOUND",
            "last_searched_at": datetime.utcnow() - timedelta(days=8),
            "opportunities_count": 1
        },
        {
            "occupation": "Retail",
            "location": "Mumbai",
            "status": "SEARCHED_FOUND",
            "last_searched_at": datetime.utcnow() - timedelta(days=60),
            "opportunities_count": 1
        },
        {
            "occupation": "Beautician",
            "location": "Mumbai",
            "status": "NEVER_SEARCHED",
            "last_searched_at": None,
            "opportunities_count": 0
        },
        {
            "occupation": "Teaching",
            "location": "Mumbai",
            "status": "NEVER_SEARCHED",
            "last_searched_at": None,
            "opportunities_count": 0
        }
    ]

    for cov_data in coverage_data:
        coverage = Coverage(**cov_data)
        db.add(coverage)

    db.commit()
    print(f"Loaded {len(coverage_data)} coverage records")
    db.close()

def load_nsqf_pathways():
    """Load NSQF pathways data"""
    from sqlalchemy.orm import Session
    from models.database import NSQFPathway

    db = Session(bind=engine)

    # Check if data already exists
    if db.query(NSQFPathway).count() > 0:
        print("NSQF pathways already loaded, skipping...")
        db.close()
        return

    pathways = [
        {
            "occupation": "Tailoring",
            "role": "Tailoring Assistant",
            "nsqf_level": 3,
            "required_skills": ["stitching", "measurements", "basic tailoring", "fabric handling"],
            "skill_gaps": ["pattern making", "advanced stitching techniques"],
            "training_pathway": {
                "course_name": "Basic Tailoring and Garment Construction",
                "provider": "National Skill Development Corporation",
                "duration_months": 3,
                "modules": ["Basic stitching", "Measurements", "Pattern basics", "Garment finishing"]
            },
            "training_duration_months": 3,
            "training_availability": "Available",
            "source_label": "NSQF Level 3 - Apparel Sector"
        },
        {
            "occupation": "Embroidery",
            "role": "Embroidery Worker",
            "nsqf_level": 3,
            "required_skills": ["hand embroidery", "thread work", "design basics", "finishing"],
            "skill_gaps": ["machine embroidery", "complex designs"],
            "training_pathway": {
                "course_name": "Hand Embroidery and Traditional Craft",
                "provider": "Handicrafts Skill Council",
                "duration_months": 2,
                "modules": ["Basic embroidery", "Thread techniques", "Design reading", "Quality finishing"]
            },
            "training_duration_months": 2,
            "training_availability": "Available",
            "source_label": "NSQF Level 3 - Handicrafts Sector"
        },
        {
            "occupation": "Beauty Services",
            "role": "Beauty Assistant",
            "nsqf_level": 4,
            "required_skills": ["hair care", "basic makeup", "customer service", "hygiene"],
            "skill_gaps": ["advanced makeup", "hair styling", "salon management"],
            "training_pathway": {
                "course_name": "Beauty Therapy and Salon Management",
                "provider": "Beauty and Wellness Sector Skill Council",
                "duration_months": 4,
                "modules": ["Hair care", "Makeup basics", "Skin care", "Customer service", "Hygiene standards"]
            },
            "training_duration_months": 4,
            "training_availability": "Available",
            "source_label": "NSQF Level 4 - Beauty & Wellness Sector"
        },
        {
            "occupation": "Data Entry",
            "role": "Data Entry Operator",
            "nsqf_level": 4,
            "required_skills": ["computer basics", "typing", "MS Office", "data accuracy"],
            "skill_gaps": ["advanced Excel", "database software"],
            "training_pathway": {
                "course_name": "Computer Applications and Data Management",
                "provider": "IT-ITeS Sector Skill Council",
                "duration_months": 3,
                "modules": ["Computer fundamentals", "Typing speed", "MS Office", "Data entry accuracy", "File management"]
            },
            "training_duration_months": 3,
            "training_availability": "Available",
            "source_label": "NSQF Level 4 - IT-ITeS Sector"
        },
        {
            "occupation": "Handicraft",
            "role": "Handicraft Artisan",
            "nsqf_level": 3,
            "required_skills": ["craft making", "traditional art", "design", "finishing"],
            "skill_gaps": ["marketing", "quality standards", "pricing"],
            "training_pathway": {
                "course_name": "Traditional Handicraft and Artisan Skills",
                "provider": "Handicrafts Skill Council",
                "duration_months": 3,
                "modules": ["Craft techniques", "Design development", "Quality finishing", "Market linkages"]
            },
            "training_duration_months": 3,
            "training_availability": "Available",
            "source_label": "NSQF Level 3 - Handicrafts Sector"
        },
        {
            "occupation": "Retail",
            "role": "Retail Assistant",
            "nsqf_level": 3,
            "required_skills": ["customer service", "billing", "inventory", "communication"],
            "skill_gaps": ["POS systems", "merchandising", "store operations"],
            "training_pathway": {
                "course_name": "Retail Sales and Customer Service",
                "provider": "Retailers Association Skill Council",
                "duration_months": 2,
                "modules": ["Customer service", "Billing systems", "Inventory basics", "Communication skills"]
            },
            "training_duration_months": 2,
            "training_availability": "Available",
            "source_label": "NSQF Level 3 - Retail Sector"
        }
    ]

    for pathway_data in pathways:
        pathway = NSQFPathway(**pathway_data)
        db.add(pathway)

    db.commit()
    print(f"Loaded {len(pathways)} NSQF pathways")
    db.close()

if __name__ == "__main__":
    init_db()
