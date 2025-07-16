from unicodedata import digit
from sqlalchemy import Column, Integer, BigInteger, String, ForeignKey, Text, TIMESTAMP, CheckConstraint
from sqlalchemy.sql import func
from app.core.db import Base

class SubmissionReview(Base):
    __tablename__ = "Review"

    review_id = Column(BigInteger, primary_key=True, index=True)
    submission_id = Column(BigInteger, ForeignKey("Submission.submission_id"), nullable=False)
    reviewed_by = Column(String(50), ForeignKey("User.user_id"), nullable=False)
    status = Column(String(50), nullable=False)
    remarks = Column(Text)
    last_review = Column(TIMESTAMP(timezone=True), server_default=func.now())

    __table_args__ = (
        CheckConstraint("status IN ('Approved', 'Rollback')", name="Review_status"),
    )
