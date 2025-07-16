import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Semester } from './semester.entity';

@Entity('Subject')
export class Subject {
  @PrimaryGeneratedColumn()
  subject_id: number;

  @Column()
  sem_id: number;

  @Column({ length: 100, nullable: true })
  subject_name: string;

  @ManyToOne(() => Semester, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'sem_id' })
  semester: Semester;
}