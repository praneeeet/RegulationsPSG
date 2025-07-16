from sqlalchemy import Column, Integer, ForeignKey, CheckConstraint, String
from app.core.db import Base

class Semester(Base):
    __tablename__ = "Semester"

    semester_id = Column(String(10), primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("Course.course_id"), nullable=False)
    semester_num = Column(Integer, nullable=False)
    dept_id = Column(String(10), ForeignKey("Course.dept_id"), nullable=False)

    __table_args__ = (
        CheckConstraint("semester_number BETWEEN 1 AND 8", name="Semester_semnum"),
    )
