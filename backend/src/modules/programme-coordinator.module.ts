import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProgramCoordinatorController } from '../controllers/programme-coordinator.controller';
import { ProgramCoordinatorService } from '../services/programme-coordinator.service';
import { SubmissionService } from '../services/submission.service';
import { AuthService } from '../auth/auth.service';
import { Submission } from '../entities/submission.entity';
import { Review } from '../entities/review.entity';
import { User } from '../entities/user.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Submission, Review, User]),
    AuthModule,
  ],
  controllers: [ProgramCoordinatorController],
  providers: [ProgramCoordinatorService, SubmissionService, AuthService],
})
export class ProgramCoordinatorModule {}
