import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Department } from './department.entity';

@Entity('Course')
export class Course {
  @PrimaryColumn()
  course_id: number;

  @PrimaryColumn()
  dept_id: number;

  @Column({ length: 100 })
  course_name: string;

  @ManyToOne(() => Department, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'dept_id' })
  department: Department;
}