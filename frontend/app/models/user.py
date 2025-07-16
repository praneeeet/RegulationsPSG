from sqlalchemy import Column, Integer, String, ForeignKey, CheckConstraint
from app.core.db import Base

class User(Base):
    __tablename__ = "User"

    user_id = Column(String(10), primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    role = Column(String(50), nullable=False)
    dept_id = Column(String, ForeignKey("Departments.department_id"))

    __table_args__ = (
        CheckConstraint(
            "role IN ('Program_Coordinator', 'HOD', 'Dean', 'Principal', 'Admin')",
            name="User_role"
        ),
    )
