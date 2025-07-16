import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Submission } from '../entities/submission.entity';
import { CreateSubmissionDto, SubmissionOutDto } from '../dtos/create-submission.dto';

@Injectable()
export class SubmissionService {
  constructor(
    @InjectRepository(Submission)
    private submissionRepository: Repository<Submission>,
  ) {}

  async createSubmission(createSubmissionDto: CreateSubmissionDto): Promise<Submission> {
    const newSubmission = this.submissionRepository.create({
      ...createSubmissionDto,
      submitted_at: new Date(),
      status: 'Pending',
      approval_level: 'L1',
    });
    return this.submissionRepository.save(newSubmission);
  }

  async getRolledBackSubmissions(userId: number): Promise<SubmissionOutDto[]> {
    const submissions = await this.submissionRepository
      .createQueryBuilder('submission')
      .leftJoinAndSelect('submission.course', 'course')
      .leftJoinAndSelect('submission.department', 'department')
      .where('submission.user_id = :userId', { userId })
      .andWhere('submission.status = :status', { status: 'Rolled Back' })
      .getMany();

    return submissions.map((submission) => ({
      submission_id: submission.submission_id,
      user_id: submission.user_id,
      course_id: submission.course_id,
      dept_id: submission.dept_id,
      title: submission.title,
      submitted_at: submission.submitted_at,
      status: submission.status,
      approval_level: submission.approval_level,
      pdf_url: submission.pdf_url,
      remarks: submission.remarks,
      course: submission.course,
      department: submission.department,
    }));
  }

  async getSubmissionStatus(userId: number, submissionId: number): Promise<SubmissionOutDto> {
    const submission = await this.submissionRepository
      .createQueryBuilder('submission')
      .leftJoinAndSelect('submission.course', 'course')
      .leftJoinAndSelect('submission.department', 'department')
      .where('submission.submission_id = :submissionId', { submissionId })
      .andWhere('submission.user_id = :userId', { userId })
      .getOne();

    if (!submission) {
      throw new HttpException('Submission not found', HttpStatus.NOT_FOUND);
    }

    return {
      submission_id: submission.submission_id,
      user_id: submission.user_id,
      course_id: submission.course_id,
      dept_id: submission.dept_id,
      title: submission.title,
      submitted_at: submission.submitted_at,
      status: submission.status,
      approval_level: submission.approval_level,
      pdf_url: submission.pdf_url,
      remarks: submission.remarks,
    };
  }
}