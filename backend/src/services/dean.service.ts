import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Submission } from '../entities/submission.entity';
import { Review } from '../entities/review.entity';
import { User } from '../entities/user.entity';
import { ReviewSubmissionDto, ReviewOutDto } from '../dtos/review-submission.dto';
import { SubmissionService } from '../services/submission.service';
import { CreateSubmissionDto } from '../dtos/create-submission.dto';


@Injectable()
export class DeanService {
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
    if (currentUser.role !== 'Dean') {
      throw new HttpException('Only Deans can view pending submissions', HttpStatus.FORBIDDEN);
    }

    return this.submissionRepository
      .createQueryBuilder('submission')
      .leftJoinAndSelect('submission.user', 'user')
      .leftJoinAndSelect('submission.course', 'course')
      .leftJoinAndSelect('submission.department', 'department')
      .where('submission.status = :status', { status: 'Pending' })
      .andWhere('submission.approval_level = :level', { level: 'L2' })
      .getMany();
  }

  async reviewSubmission(
    submissionId: number,
    reviewDto: ReviewSubmissionDto,
    currentUser: User,
  ): Promise<ReviewOutDto> {
    if (currentUser.role !== 'Dean') {
      throw new HttpException('Only Deans can review submissions', HttpStatus.FORBIDDEN);
    }

    const submission = await this.submissionRepository.findOne({
      where: { submission_id: submissionId, approval_level: 'L2', status: 'Pending' },
      relations: ['user'],
    });
    if (!submission) {
      throw new HttpException('Submission not found or not at Dean level', HttpStatus.NOT_FOUND);
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
      newSubmission.approval_level = 'L3';
      newSubmission.status = 'Finalized';
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
    if (currentUser.role !== 'Dean') {
      throw new HttpException('Only Deans can check submission status', HttpStatus.FORBIDDEN);
    }

    const submission = await this.submissionRepository
      .createQueryBuilder('submission')
      .leftJoinAndSelect('submission.user', 'user')
      .leftJoinAndSelect('submission.course', 'course')
      .leftJoinAndSelect('submission.department', 'department')
      .where('submission.submission_id = :submissionId', { submissionId })
      .getOne();

    if (!submission) {
      throw new HttpException('Submission not found', HttpStatus.NOT_FOUND);
    }

    return submission;
  }
}