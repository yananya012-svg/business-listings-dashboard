from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, declarative_base
from .config import settings

engine = create_engine(
    settings.get_url(),
    pool_pre_ping=True,
    pool_recycle=3600,
    pool_size=10,
    max_overflow=20
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_database():
    """
    Ensures the business_dashboard database exists, then creates tables.
    """
    # Connect without database specified to execute CREATE DATABASE
    server_engine = create_engine(settings.get_url(database=""), isolation_level="AUTOCOMMIT")
    with server_engine.connect() as conn:
        conn.execute(text(f"CREATE DATABASE IF NOT EXISTS `{settings.DB_NAME}` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"))
    
    # Create tables
    Base.metadata.create_all(bind=engine)
