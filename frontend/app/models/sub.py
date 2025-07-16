from sqlalchemy import Column, Integer, String, ForeignKey
from app.core.db import Base

class Subject(Base):
    __tablename__ = "Subject"

    subject_id = Column(String(10), primary_key=True, index=True)
    semester_id = Column(String(10), ForeignKey("Semester.semester_id"), nullable=False)
    name = Column(String(255), nullable=False)
    subject_code = Column(String(20), nullable=False)  # e.g., '15xw11'
