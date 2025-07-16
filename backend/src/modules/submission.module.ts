import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubmissionController } from '../controllers/submission.controller';
import { SubmissionService } from '../services/submission.service';
import { Submission } from '../entities/submission.entity';
import { User } from '../entities/user.entity';
import { Course } from '../entities/course.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Submission, User, Course]),
    AuthModule,
  ],
  controllers: [SubmissionController],
  providers: [SubmissionService],
  exports: [SubmissionService],
})
export class SubmissionModule {}