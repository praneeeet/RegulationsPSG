import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Submission } from '../entities/submission.entity';
import { Review } from '../entities/review.entity';
import { User } from '../entities/user.entity';
import { SubmissionService } from './submission.service';
import { CreateSubmissionDto } from '../dtos/create-submission.dto';
import { SubmissionResponse } from '../dtos/submission-response.dto';

@Injectable()
export class ProgramCoordinatorService {
  constructor(
    @InjectRepository(Submission)
    private submissionRepository: Repository<Submission>,
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
    private submissionService: SubmissionService,
  ) {}

  async createSubmission(currentUser: User, createSubmissionDto: CreateSubmissionDto): Promise<SubmissionResponse> {
    if (currentUser.role !== 'Program_Coordinator') {
      throw new HttpException('Only Program Coordinators can create submissions', HttpStatus.FORBIDDEN);
    }

    createSubmissionDto.user_id = currentUser.user_id;
    createSubmissionDto.dept_id = currentUser.dept_id;

    const submission = await this.submissionService.createSubmission(createSubmissionDto);

    return {
      submission_id: submission.submission_id,
      from_whom: { user_id: submission.user_id, username: currentUser.username, role: currentUser.role },
      title: submission.title || '',
      submitted_at: submission.submitted_at,
      status: submission.status,
      approval_level: submission.approval_level,
      pdf_url: submission.pdf_url || null,
      remarks: submission.remarks || null,
      course: { course_id: submission.course_id, dept_id: submission.dept_id, course_name: '' },
      department: { dept_id: submission.dept_id, department_name: '' },
      history: [
        {
          submission_id: submission.submission_id,
          status: submission.status,
          approval_level: submission.approval_level,
          submitted_at: submission.submitted_at,
          remarks: submission.remarks || null,
          reviews: [],
        },
      ],
    };
  }

async getRolledBackSubmissions(currentUser: User): Promise<SubmissionResponse[]> {
  if (currentUser.role !== 'Program_Coordinator') {
    throw new HttpException('Only Program Coordinators can view their submissions', HttpStatus.FORBIDDEN);
  }

  const allSubmissions = await this.submissionRepository
    .createQueryBuilder('submission')
    .leftJoinAndSelect('submission.user', 'user')
    .leftJoinAndSelect('submission.course', 'course')
    .leftJoinAndSelect('submission.department', 'department')
    .where('submission.user_id = :userId', { userId: currentUser.user_id })
    .andWhere('submission.status = :status', { status: 'Rolled Back' })
    .andWhere('submission.approval_level = :level', { level: 'L1' })
    .orderBy('submission.submitted_at', 'ASC')
    .getMany();

  if (!allSubmissions.length) {
    return [];
  }

  const submissionGroups = new Map<string, Submission[]>();
  allSubmissions.forEach(submission => {
    const key = `${submission.user_id}-${submission.course_id}-${submission.dept_id}-${submission.title || 'undefined'}`;
    if (!submissionGroups.has(key)) {
      submissionGroups.set(key, []);
    }
    submissionGroups.get(key)!.push(submission);
  });

 const rolledBackSubmissions = await Promise.all(
  Array.from(submissionGroups.entries()).map(async ([key, group]) => {
    const keyParts = key.split('-');
    const userId = Number(keyParts[0]);
    const courseId = Number(keyParts[1]);
    const deptId = Number(keyParts[2]);
    const title = keyParts.slice(3).join('-') === 'undefined' ? '' : keyParts.slice(3).join('-');

    const history = await this.getSubmissionHistory(userId, courseId, deptId, title);
    const latestSubmission = group[group.length - 1];

    // ✅ NEW: Skip if latest submission is approved
    if (latestSubmission.status === 'Approved') {
      return null;
    }

    const hasAnyRollback = history.some(sub =>
      sub.reviews.some(review => review.status === 'Rolled Back')
    );

    if (!hasAnyRollback) return null;

    return {
      submission_id: latestSubmission.submission_id,
      from_whom: latestSubmission.user
        ? { user_id: latestSubmission.user.user_id, username: latestSubmission.user.username, role: latestSubmission.user.role }
        : null,
      title: latestSubmission.title || '',
      submitted_at: latestSubmission.submitted_at,
      status: latestSubmission.status,
      approval_level: latestSubmission.approval_level,
      pdf_url: latestSubmission.pdf_url || null,
      remarks: latestSubmission.remarks || null,
      course: latestSubmission.course
        ? { course_id: latestSubmission.course.course_id, dept_id: latestSubmission.course.dept_id, course_name: latestSubmission.course.course_name || '' }
        : { course_id: latestSubmission.course_id, dept_id: latestSubmission.dept_id, course_name: '' },
      department: latestSubmission.department
        ? { dept_id: latestSubmission.department.dept_id, department_name: (latestSubmission.department as any).department_name || '' }
        : { dept_id: latestSubmission.dept_id, department_name: '' },
      history,
    };
    })
  );

  return rolledBackSubmissions.filter((submission): submission is SubmissionResponse => submission !== null);
}


  async getMySubmissions(currentUser: User): Promise<SubmissionResponse[]> {
    if (currentUser.role !== 'Program_Coordinator') {
      throw new HttpException('Only Program Coordinators can view their submissions', HttpStatus.FORBIDDEN);
    }

    const submissions = await this.submissionRepository
      .createQueryBuilder('submission')
      .leftJoinAndSelect('submission.user', 'user')
      .leftJoinAndSelect('submission.course', 'course')
      .leftJoinAndSelect('submission.department', 'department')
      .where('submission.user_id = :userId', { userId: currentUser.user_id })
      .orderBy('submission.submitted_at', 'ASC')
      .getMany();

    return await Promise.all(
      submissions.map(async (submission) => {
        const history = await this.getSubmissionHistory(
          submission.user_id,
          submission.course_id,
          submission.dept_id,
          submission.title || '',
        );

        return {
          submission_id: submission.submission_id,
          from_whom: submission.user
            ? { user_id: submission.user.user_id, username: submission.user.username, role: submission.user.role }
            : null,
          title: submission.title || '',
          submitted_at: submission.submitted_at,
          status: submission.status,
          approval_level: submission.approval_level,
          pdf_url: submission.pdf_url || null,
          remarks: submission.remarks || null,
          course: submission.course
            ? { course_id: submission.course.course_id, dept_id: submission.course.dept_id, course_name: submission.course.course_name || '' }
            : { course_id: submission.course_id, dept_id: submission.dept_id, course_name: '' },
          department: submission.department
            ? { dept_id: submission.department.dept_id, department_name: submission.department.department_name || '' }
            : { dept_id: submission.dept_id, department_name: '' },
          history,
        };
      }),
    );
  }

  async getSubmissionHistory(userId: number, courseId: number, deptId: number, title: string): Promise<any[]> {
    const relatedSubmissions = await this.submissionRepository
      .createQueryBuilder('submission')
      .leftJoinAndSelect('submission.user', 'user')
      .where('submission.user_id = :userId', { userId })
      .andWhere('submission.course_id = :courseId', { courseId })
      .andWhere('submission.dept_id = :deptId', { deptId })
      .andWhere('submission.title = :title', { title })
      .orderBy('submission.submitted_at', 'ASC')
      .getMany();

    const history = await Promise.all(
      relatedSubmissions.map(async (submission) => {
        const reviews = await this.reviewRepository
          .createQueryBuilder('review')
          .leftJoinAndSelect('review.reviewer', 'reviewer')
          .where('review.submission_id = :submissionId', { submissionId: submission.submission_id })
          .getMany();

        return {
          submission_id: submission.submission_id,
          status: submission.status,
          approval_level: submission.approval_level,
          submitted_at: submission.submitted_at,
          remarks: submission.remarks || null,
          reviews: reviews.map(review => ({
            review_id: review.review_id,
            reviewed_by: review.reviewer ? { user_id: review.reviewer.user_id, username: review.reviewer.username, role: review.reviewer.role } : null,
            review_comment: review.review_comment,
            status: review.status,
          })),
        };
      }),
    );

    return history;
  }
}