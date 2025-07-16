import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Submission } from './submission.entity';
import { User } from './user.entity';

@Entity('Review')
export class Review {
  @PrimaryGeneratedColumn()
  review_id: number;

  @Column()
  submission_id: number;

  @Column()
  reviewed_by: number;

  @Column({ type: 'text', nullable: true })
  review_comment: string;

  @Column({ type: 'timestamp', default: () => 'NOW()' })
  reviewed_at: Date;

  @Column({ length: 50 })
  status: string;

  @ManyToOne(() => Submission, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'submission_id' })
  submission: Submission;

  @ManyToOne(() => User, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'reviewed_by' })
  reviewer: User;
}