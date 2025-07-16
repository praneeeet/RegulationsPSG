import { Controller, Get, Post, Param, Body, HttpCode, UseGuards, SetMetadata, ParseIntPipe, Req } from '@nestjs/common';
import { DeanService } from '../services/dean.service';
import { ReviewSubmissionDto, ReviewOutDto } from '../dtos/review-submission.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RoleGuard } from '../auth/role.guard';
import { Submission } from '../entities/submission.entity';
import { Request } from 'express';
import { User } from '../entities/user.entity';

@Controller('api/dean')
@UseGuards(JwtAuthGuard, RoleGuard)
@SetMetadata('roles', ['Dean'])
export class DeanController {
  constructor(private readonly deanService: DeanService) {}

  @Get('submissions')
  async getPendingSubmissions(@Req() request: Request): Promise<Submission[]> {
    const currentUser = request.user as User;
    return this.deanService.getPendingSubmissions(currentUser);
  }

  @Post('submissions/:submission_id/review')
  @HttpCode(201)
  async reviewSubmission(
    @Param('submission_id', ParseIntPipe) submissionId: number,
    @Body() reviewDto: ReviewSubmissionDto,
    @Req() request: Request,
  ): Promise<ReviewOutDto> {
    const currentUser = request.user as User;
    return this.deanService.reviewSubmission(submissionId, reviewDto, currentUser);
  }

  @Get('submissions/status/:submission_id')
  async getSubmissionStatus(
    @Param('submission_id', ParseIntPipe) submissionId: number,
    @Req() request: Request,
  ): Promise<Submission> {
    const currentUser = request.user as User;
    return this.deanService.getSubmissionStatus(submissionId, currentUser);
  }
}