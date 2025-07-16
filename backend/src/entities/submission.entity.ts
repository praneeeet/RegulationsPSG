import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Course } from './course.entity';
import { Department } from './department.entity';

@Entity('Submission')
export class Submission {
  @PrimaryGeneratedColumn()
  submission_id: number;

  @Column()
  user_id: number;

  @Column()
  course_id: number;

  @Column()
  dept_id: number;

  @Column({ length: 255, nullable: true })
  title: string;

  @Column({ type: 'timestamp', default: () => 'NOW()' })
  submitted_at: Date;

  @Column({ length: 50, default: 'Pending' })
  status: string;

  @Column({ length: 10 })
  approval_level: string;

  @Column({ type: 'text', nullable: true })
  pdf_url: string;

  @Column({ type: 'text', nullable: true })
  remarks: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Course, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn([{ name: 'course_id', referencedColumnName: 'course_id' }, { name: 'dept_id', referencedColumnName: 'dept_id' }])
  course: Course;

  @ManyToOne(() => Department, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'dept_id' })
  department: Department;
}