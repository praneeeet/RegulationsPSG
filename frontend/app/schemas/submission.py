from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class SubmissionBase(BaseModel):
    course_id: str
    dept_id: str
    remarks: Optional[str] = None
    pdf_url: str

class SubmissionCreate(SubmissionBase):
    pass

class SubmissionOut(SubmissionBase):
    submission_id: int
    user_id: int
    status: str
    last_edit: datetime

    class Config:
        orm_mode = True
