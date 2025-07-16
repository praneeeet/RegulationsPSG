from fastapi import FastAPI
from app.api import coordinator  # Import the module directly
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker



# Database URL (update with your PostgreSQL credentials)
SQLALCHEMY_DATABASE_URL = "postgresql://postgres:1234@localhost:5432/RegulationsPSG"

# Create the SQLAlchemy engine
engine = create_engine(SQLALCHEMY_DATABASE_URL)

# Create a session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for SQLAlchemy models
Base = declarative_base()
app = FastAPI(title="Regulations Portal API")

# Include the coordinator routes
app.include_router(coordinator, prefix="/api")

# Create database tables
Base.metadata.create_all(bind=engine)

@app.get("/")
def read_root():
    return {"message": "Regulations Portal API"}