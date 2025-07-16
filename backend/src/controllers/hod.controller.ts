import { Controller, Get, Post, Param, Body, ParseIntPipe, UseGuards, SetMetadata, Req } from '@nestjs/common';
import { HodService } from '../services/hod.service';
import { ReviewSubmissionDto, ReviewOutDto } from '../dtos/review-submission.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RoleGuard } from '../auth/role.guard';
import { Submission } from '../entities/submission.entity';
import { Request } from 'express';
import { User } from '../entities/user.entity';

@Controller('api/hod')
@UseGuards(JwtAuthGuard, RoleGuard)
@SetMetadata('roles', ['HOD'])
export class HodController {
  constructor(private hodService: HodService) {}

  @Get('submissions/pending')
  async getPendingSubmissions(@Req() request: Request): Promise<any[]> {
    const currentUser = request.user as User;
    return this.hodService.getPendingSubmissions(currentUser);
  }

  @Post('submissions/:id/review')
  async reviewSubmission(
    @Param('id', ParseIntPipe) submissionId: number,
    @Body() reviewDto: ReviewSubmissionDto,
    @Req() request: Request,
  ): Promise<ReviewOutDto> {
    const currentUser = request.user as User;
    return this.hodService.reviewSubmission(submissionId, reviewDto, currentUser);
  }

  @Get('submissions/:id/status')
  async getSubmissionStatus(
    @Param('id', ParseIntPipe) submissionId: number,
    @Req() request: Request,
  ): Promise<any> {
    const currentUser = request.user as User;
    return this.hodService.getSubmissionStatus(submissionId, currentUser);
  }
}