import { Controller } from '@nestjs/common';
import { SemesterService } from '../services/semester.service';

@Controller('api/semesters')
export class SemesterController {
  constructor(private readonly semesterService: SemesterService) {}
}