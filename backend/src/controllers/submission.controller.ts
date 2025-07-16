import { Controller, Post, Body, UseGuards, SetMetadata, Req } from '@nestjs/common';
import { SubmissionService } from '../services/submission.service';
import { CreateSubmissionDto } from '../dtos/create-submission.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RoleGuard } from '../auth/role.guard';
import { Request } from 'express';
import { User } from '../entities/user.entity';

@Controller('api/submissions')
@UseGuards(JwtAuthGuard, RoleGuard)
@SetMetadata('roles', ['Program_Coordinator'])
export class SubmissionController {
  constructor(private submissionService: SubmissionService) {}

  @Post()
  async createSubmission(
    @Body() createSubmissionDto: CreateSubmissionDto,
    @Req() request: Request,
  ) {
    const currentUser = request.user as User;
    return this.submissionService.createSubmission(createSubmissionDto);
  }
}