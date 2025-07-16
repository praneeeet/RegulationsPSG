from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from pydantic import BaseModel
from app.core.db import get_db
from sqlalchemy.orm import Session
from app.schemas.course import CourseCreate, CourseOut
from app.schemas.sem import SemesterCreate, SemesterOut
from app.schemas.sub import SubjectCreate, SubjectOut
from app.schemas.submission import SubmissionCreate, SubmissionOut
from app.models.course import Course
from app.models.sem import Semester
from app.models.sub import Subject
from app.models.submission import Submission
from app.core.security import get_current_user
from app.models.user import User
from app.services.notification import notify_hod

router = APIRouter()

# Request model for submitting a course with semesters and subjects
class CourseSubmissionRequest(BaseModel):
    course: CourseCreate
    semesters: List[SemesterCreate]
    subjects: List[List[SubjectCreate]]  # List of subjects per semester

# 1. Submit a new course with semesters and subjects
@router.post("/submit-course/", response_model=SubmissionOut, status_code=status.HTTP_201_CREATED)
def submit_course(
    request: CourseSubmissionRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Check if user is a Program Coordinator
    if current_user.role != "Program_Coordinator":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only Program Coordinators can submit courses"
        )

    # Validate input
    if len(request.semesters) != len(request.subjects):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Number of semesters must match number of subject lists"
        )

    # Create the Course
    db_course = Course(**request.course.dict())
    db.add(db_course)
    db.commit()
    db.refresh(db_course)

    # Create Semesters and Subjects
    semester_objects = []
    for semester_data, subject_list in zip(request.semesters, request.subjects):
        semester_data.course_id = db_course.course_id
        semester_data.dept_id = db_course.department_id
        db_semester = Semester(**semester_data.dict())
        db.add(db_semester)
        db.commit()
        db.refresh(db_semester)
        semester_objects.append(db_semester)

        # Create Subjects for each Semester
        for subject_data in subject_list:
            subject_data.semester_id = db_semester.semester_id
            db_subject = Subject(**subject_data.dict())
            db.add(db_subject)
        db.commit()

    # Create Submission
    submission_data = SubmissionCreate(
        course_id=db_course.course_id,
        dept_id=db_course.department_id,
        pdf_url=f"/pdfs/{db_course.course_id}.pdf",  # Placeholder for PDF generation
        remarks=None
    )
    db_submission = Submission(
        **submission_data.dict(),
        user_id=current_user.user_id,
        status="Pending",
        last_edit=db.func.now()
    )
    db.add(db_submission)
    db.commit()
    db.refresh(db_submission)

    # Email notification to HOD (L1 approval)
    notify_hod(db_submission, db)

    return db_submission

# 2. View all submissions by the Program Coordinator
@router.get("/my-submissions/", response_model=List[SubmissionOut])
def get_my_submissions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "Program_Coordinator":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only Program Coordinators can view their submissions"
        )

    submissions = db.query(Submission).filter(Submission.user_id == current_user.user_id).all()
    return submissions

# 3. Resubmit a rolled-back submission
@router.put("/resubmit/{submission_id}/", response_model=SubmissionOut)
def resubmit_course(
    submission_id: int,
    request: CourseSubmissionRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "Program_Coordinator":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only Program Coordinators can resubmit courses"
        )

    # Check if submission exists and belongs to the user
    db_submission = db.query(Submission).filter(
        Submission.submission_id == submission_id,
        Submission.user_id == current_user.user_id
    ).first()

    if not db_submission:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Submission not found or you do not have access to it"
        )

    # Check if submission is rolled back
    if db_submission.status != "Rolled Back":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only rolled-back submissions can be resubmitted"
        )

    # Delete existing course, semesters, and subjects
    db.query(Subject).filter(
        Subject.semester_id.in_(
            db.query(Semester.semester_id).filter(Semester.course_id == db_submission.course_id)
        )
    ).delete()
    db.query(Semester).filter(Semester.course_id == db_submission.course_id).delete()
    db.query(Course).filter(Course.course_id == db_submission.course_id).delete()

    # Create new Course
    db_course = Course(**request.course.dict())
    db.add(db_course)
    db.commit()
    db.refresh(db_course)

    # Create Semesters and Subjects
    if len(request.semesters) != len(request.subjects):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Number of semesters must match number of subject lists"
        )

    for semester_data, subject_list in zip(request.semesters, request.subjects):
        semester_data.course_id = db_course.course_id
        semester_data.dept_id = db_course.department_id
        db_semester = Semester(**semester_data.dict())
        db.add(db_semester)
        db.commit()
        db.refresh(db_semester)

        for subject_data in subject_list:
            subject_data.semester_id = db_semester.semester_id
            db_subject = Subject(**subject_data.dict())
            db.add(db_subject)
        db.commit()

    # Update Submission
    db_submission.course_id = db_course.course_id
    db_submission.dept_id = db_course.department_id
    db_submission.status = "Pending"
    db_submission.last_edit = db.func.now()
    db_submission.pdf_url = f"/pdfs/{db_course.course_id}.pdf"  # Placeholder for PDF generation
    db.commit()
    db.refresh(db_submission)

    # Email notification to HOD (L1 approval)
    notify_hod(db_submission, db)

    return db_submission