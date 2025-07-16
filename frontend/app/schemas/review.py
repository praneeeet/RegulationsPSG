from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class SubmissionReviewBase(BaseModel):
    submission_id: int
    reviewed_by: str
    status: str
    remarks: Optional[str] = None

class SubmissionReviewCreate(SubmissionReviewBase):
    pass

class SubmissionReviewOut(SubmissionReviewBase):
    review_id: int
    last_review: datetime

    class Config:
        orm_mode = True
