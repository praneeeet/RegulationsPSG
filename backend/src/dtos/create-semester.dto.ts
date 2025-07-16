import { IsInt } from 'class-validator';

export class CreateSemesterDto {
  @IsInt()
  semester_number: number;

  @IsInt()
  course_id: number;

  @IsInt()
  dept_id: number;
}

export class SemesterOutDto {
  semester_id: number;
  semester_number: number;
  course_id: number;
  dept_id: number;
}