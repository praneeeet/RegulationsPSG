from pydantic import BaseModel

class SemesterBase(BaseModel):
    course_id: str
    semester_number: int
    dept_id: str

class SemesterCreate(SemesterBase):
    semester_id: str

class SemesterOut(SemesterCreate):
    class Config:
        orm_mode = True
