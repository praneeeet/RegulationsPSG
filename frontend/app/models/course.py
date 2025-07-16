from sqlalchemy import Column, Integer, String, ForeignKey, Date
from app.core.db import Base

class Course(Base):
    __tablename__ = "Course"

    course_id = Column(String(10), primary_key=True, index=True)
    dept_id = Column(String, ForeignKey("Department.department_id"), nullable=False)
    name = Column(String(255), unique=True, nullable=False)
    year = Column(Date, nullable=False)
