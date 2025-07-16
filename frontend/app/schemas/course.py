from pydantic import BaseModel
from typing import Literal

class CourseBase(BaseModel):
    course_id: str  # e.g., '22AMCS01'
    department_id: str  # e.g., 'AMCS'
    name: str
    year: int  # Academic year like 2024

class CourseCreate(CourseBase):
    pass

class CourseOut(CourseBase):
    class Config:
        orm_mode = True
