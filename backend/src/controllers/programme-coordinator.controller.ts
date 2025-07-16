import { Controller, Post, Body, Get, UseGuards, SetMetadata, Req } from '@nestjs/common';
import { ProgramCoordinatorService } from '../services/programme-coordinator.service';
import { CreateSubmissionDto } from '../dtos/create-submission.dto';
import { SubmissionResponse } from '../dtos/submission-response.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RoleGuard } from '../auth/role.guard';
import { Request } from 'express';
import { User } from '../entities/user.entity';

@Controller('api/program-coordinator')
@UseGuards(JwtAuthGuard, RoleGuard)
@SetMetadata('roles', ['Program_Coordinator'])
export class ProgramCoordinatorController {
  constructor(
    private programCoordinatorService: ProgramCoordinatorService,
  ) {}

  @Post('submissions')
  async createSubmission(
    @Body() createSubmissionDto: CreateSubmissionDto,
    @Req() request: Request,
  ): Promise<SubmissionResponse> {
    const currentUser = request.user as User;
    return this.programCoordinatorService.createSubmission(currentUser, createSubmissionDto);
  }

  @Get('submissions/rolled-back')
  async getDeanRolledBackSubmissions(@Req() request: Request): Promise<SubmissionResponse[]> {
    const currentUser = request.user as User;
    return this.programCoordinatorService.getRolledBackSubmissions(currentUser);
  }

  @Get('submissions')
  async getMySubmissions(@Req() request: Request): Promise<SubmissionResponse[]> {
    const currentUser = request.user as User;
    return this.programCoordinatorService.getMySubmissions(currentUser);
  }
}