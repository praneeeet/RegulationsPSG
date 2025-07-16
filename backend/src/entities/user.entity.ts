import {
  Entity,
  Column,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { Department } from '../entities/department.entity';
import * as bcrypt from 'bcrypt';

@Entity('Users')
export class User {
  @PrimaryColumn()
  user_id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  reset_token: string;

  @Column({ type: 'timestamp', nullable: true })
  reset_token_expiry: Date;

  @Column()
  dept_id: number;

  @Column()
  role: string;

  @ManyToOne(() => Department, (department) => department.users)
  @JoinColumn({ name: 'dept_id' }) // ✅ Explicitly map the FK column
  department: Department;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
