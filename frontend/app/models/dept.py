from sqlalchemy import Column, String
from app.core.db import Base

class Department(Base):
    __tablename__ = "Department"

    department_id = Column(String(10), primary_key=True, index=True)  # e.g., 'amcs'
    name = Column(String(255), unique=True, nullable=False)
