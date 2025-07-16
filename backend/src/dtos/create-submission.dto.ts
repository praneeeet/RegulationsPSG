import { IsInt, IsString, IsOptional } from 'class-validator';

export class CreateSubmissionDto {
  @IsInt()
  @IsOptional() // Added to make user_id optional in the request
  user_id: number;

  @IsInt()
  course_id: number;

  @IsInt()
  //@IsOptional()
  dept_id: number;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  pdf_url?: string;

  @IsString()
  @IsOptional()
  remarks?: string;
}

export class SubmissionOutDto {
  submission_id: number;
  user_id: number;
  course_id: number;
  dept_id: number;
  title: string;
  submitted_at: Date;
  status: string;
  approval_level: string;
  pdf_url: string;
  remarks: string;
}