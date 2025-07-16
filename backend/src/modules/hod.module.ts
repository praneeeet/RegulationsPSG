import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HodController } from '../controllers/hod.controller';
import { HodService } from '../services/hod.service';
import { Submission } from '../entities/submission.entity';
import { Review } from '../entities/review.entity';
import { User } from '../entities/user.entity';
import { AuthModule } from '../auth/auth.module';
import { SubmissionModule } from './submission.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Submission, Review, User]),
    AuthModule,
    SubmissionModule,
  ],
  controllers: [HodController],
  providers: [HodService],
})
export class HodModule {}