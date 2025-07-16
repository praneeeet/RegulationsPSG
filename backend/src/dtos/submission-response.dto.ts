export interface SubmissionResponse {
  submission_id: number;
  from_whom: { user_id: number; username: string; role: string } | null;
  title: string;
  submitted_at: Date;
  status: string;
  approval_level: string;
  pdf_url: string | null;
  remarks: string | null;
  course: { course_id: number; dept_id: number; course_name: string };
  department: { dept_id: number; department_name: string };
  history: Array<{
    submission_id: number;
    status: string;
    approval_level: string;
    submitted_at: Date;
    remarks: string | null;
    reviews: Array<{
      review_id: number;
      reviewed_by: { user_id: number; username: string; role: string } | null;
      review_comment: string | null;
      status: string;
    }>;
  }>;
}