import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Submission } from '../entities/submission.entity';
import { Review } from '../entities/review.entity';
import { User } from '../entities/user.entity';
import { ReviewSubmissionDto, ReviewOutDto } from '../dtos/review-submission.dto';
import { SubmissionService } from './submission.service';
import { CreateSubmissionDto } from '../dtos/create-submission.dto';

@Injectable()
export class HodService {
  constructor(
    @InjectRepository(Submission)
    private submissionRepository: Repository<Submission>,
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private submissionService: SubmissionService,
  ) {}

  async getPendingSubmissions(currentUser: User): Promise<Submission[]> {
    if (currentUser.role !== 'HOD') {
      throw new HttpException('Only HODs can view pending submissions', HttpStatus.FORBIDDEN);
    }

    return this.submissionRepository
      .createQueryBuilder('submission')
      .leftJoinAndSelect('submission.user', 'user')
      .leftJoinAndSelect('submission.course', 'course')
      .leftJoinAndSelect('submission.department', 'department')
      .where('submission.dept_id = :deptId', { deptId: currentUser.dept_id })
      .andWhere('submission.status = :status', { status: 'Pending' })
      .andWhere('submission.approval_level = :level', { level: 'L1' })
      .getMany();
  }

  async reviewSubmission(
    submissionId: number,
    reviewDto: ReviewSubmissionDto,
    currentUser: User,
  ): Promise<ReviewOutDto> {
    if (currentUser.role !== 'HOD') {
      throw new HttpException('Only HODs can review submissions', HttpStatus.FORBIDDEN);
    }

    const submission = await this.submissionRepository.findOne({
      where: { submission_id: submissionId, approval_level: 'L1', status: 'Pending' },
      relations: ['user'],
    });
    if (!submission) {
      throw new HttpException('Submission not found or not at HOD level', HttpStatus.NOT_FOUND);
    }

    if (submission.dept_id !== currentUser.dept_id) {
      throw new HttpException('You can only review submissions in your department', HttpStatus.FORBIDDEN);
    }

    const review = this.reviewRepository.create({
      submission_id: submissionId,
      reviewed_by: currentUser.user_id,
      review_comment: reviewDto.remarks,
      status: reviewDto.status,
    });
    const savedReview = await this.reviewRepository.save(review);

    submission.status = reviewDto.status;
    submission.remarks = reviewDto.remarks;
    await this.submissionRepository.save(submission);

    if (reviewDto.status === 'Approved') {
      const newSubmissionDto: CreateSubmissionDto = {
        user_id: submission.user_id,
        course_id: submission.course_id,
        dept_id: submission.dept_id,
        title: submission.title,
        pdf_url: submission.pdf_url,
        remarks: "",
      };
      const newSubmission = await this.submissionService.createSubmission(newSubmissionDto);
      newSubmission.approval_level = 'L2';
      await this.submissionRepository.save(newSubmission);
    } else if (reviewDto.status === 'Rolled Back') {
      const newSubmissionDto: CreateSubmissionDto = {
        user_id: submission.user_id,
        course_id: submission.course_id,
        dept_id: submission.dept_id,
        title: submission.title,
        pdf_url: submission.pdf_url,
        remarks: reviewDto.remarks,
      };
      const newSubmission = await this.submissionService.createSubmission(newSubmissionDto);
      newSubmission.approval_level = 'L1';
      newSubmission.status = 'Rolled Back';
      await this.submissionRepository.save(newSubmission);
    }

    return savedReview;
  }

  async getSubmissionStatus(submissionId: number, currentUser: User): Promise<Submission> {
    if (currentUser.role !== 'HOD') {
      throw new HttpException('Only HODs can check submission status', HttpStatus.FORBIDDEN);
    }

    const submission = await this.submissionRepository
      .createQueryBuilder('submission')
      .leftJoinAndSelect('submission.user', 'user')
      .leftJoinAndSelect('submission.course', 'course')
      .leftJoinAndSelect('submission.department', 'department')
      .where('submission.submission_id = :submissionId', { submissionId })
      .andWhere('submission.dept_id = :deptId', { deptId: currentUser.dept_id })
      .getOne();

    if (!submission) {
      throw new HttpException('Submission not found in your department', HttpStatus.NOT_FOUND);
    }

    return submission;
  }
}