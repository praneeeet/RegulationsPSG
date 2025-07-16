from pydantic import BaseModel

class SubjectBase(BaseModel):
    subject_id: int  # could be SERIAL in DB
    subject_code: str        # e.g., '15XW11'
    semester_id: int
    name: str

class SubjectCreate(SubjectBase):
    pass

class SubjectOut(SubjectBase):
    class Config:
        orm_mode = True
