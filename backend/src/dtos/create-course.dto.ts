import { IsString, IsInt } from 'class-validator';

export class CreateCourseDto {
  @IsString()
  course_name: string;

  @IsInt()
  dept_id: number;
}

export class CourseOutDto {
  course_id: number;
  dept_id: number;
  course_name: string;
}