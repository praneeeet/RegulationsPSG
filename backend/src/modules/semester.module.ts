import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SemesterController } from '../controllers/semester.controller';
import { SemesterService } from '../services/semester.service';
import { Semester } from '../entities/semester.entity';
import { Course } from '../entities/course.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Semester, Course]),
    AuthModule,
  ],
  controllers: [SemesterController],
  providers: [SemesterService],
})
export class SemesterModule {}