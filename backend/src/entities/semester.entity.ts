import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Course } from './course.entity';
import { Department } from './department.entity';

@Entity('Semester')
export class Semester {
  @PrimaryGeneratedColumn()
  semester_id: number;

  @Column()
  course_id: number;

  @Column()
  dept_id: number;

  @Column()
  semester_number: number;

  @ManyToOne(() => Course, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn([
    { name: 'course_id', referencedColumnName: 'course_id' },
    { name: 'dept_id', referencedColumnName: 'dept_id' }
  ])
  course: Course;

  @ManyToOne(() => Department, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'dept_id' })
  department: Department;
}
