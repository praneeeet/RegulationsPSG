from sqlalchemy import Column, BigInteger, String, ForeignKey, Text, TIMESTAMP, CheckConstraint
from sqlalchemy.sql import func
from app.core.db import Base

class Submission(Base):
    __tablename__ = "Submission"

    submission_id = Column(BigInteger, primary_key=True, index=True)
    user_id = Column(String(10), ForeignKey("User.user_id", ondelete="SET NULL"))
    course_id = Column(String(10), ForeignKey("Course.course_id", ondelete="CASCADE"))
    dept_id = Column(String(10), ForeignKey("Course.department_id", ondelete="CASCADE" ))
    status = Column(String(50), default="Pending", nullable=False)
    last_edit = Column(TIMESTAMP(timezone=True), server_default=func.now())
    remarks = Column(Text)
    pdf_url = Column(Text)

    __table_args__ = (
        CheckConstraint("status IN ('Pending', 'Approved', 'Rolled Back')", name="Submission_status"),
    )
