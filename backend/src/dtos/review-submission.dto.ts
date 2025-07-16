import { IsString, IsEnum } from 'class-validator';

export class ReviewSubmissionDto {
  @IsEnum(['Approved', 'Rolled Back'])
  status: 'Approved' | 'Rolled Back';

  @IsString()
  remarks: string;
}

export class ReviewOutDto {
  review_id: number;
  submission_id: number;
  reviewed_by: number;
  review_comment: string;
  reviewed_at: Date;
  status: string;
}