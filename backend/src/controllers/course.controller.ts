import { Controller } from '@nestjs/common';
import { CourseService } from '../services/course.service';

@Controller('api/courses')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}
}