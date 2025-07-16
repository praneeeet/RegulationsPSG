from pydantic import BaseModel

class DepartmentBase(BaseModel):
    name: str

class DepartmentCreate(DepartmentBase):
    department_id: str  # e.g., 'amcs'

class DepartmentOut(DepartmentCreate):
    class Config:
        orm_mode = True
