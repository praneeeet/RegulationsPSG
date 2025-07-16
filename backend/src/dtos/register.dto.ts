import { IsEmail, IsString, MinLength, IsInt, IsEnum } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  username: string;

  @IsInt()
  dept_id: number;

  @IsEnum(['Program_Coordinator', 'HOD', 'Dean'])
  role: string;
}