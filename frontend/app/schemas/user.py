from pydantic import BaseModel, EmailStr
from typing import Optional

class UserBase(BaseModel):
    name: str
    email: EmailStr
    role: str
    dept_id: Optional[int]  # Some users like Admin may not belong to a department

class UserCreate(UserBase):
    pass  # Email comes from Google SSO, just storing user if new

class UserOut(UserBase):
    user_id: int

    class Config:
        orm_mode = True
