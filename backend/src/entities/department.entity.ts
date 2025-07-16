import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { User } from './user.entity';

@Entity('Department') // assuming your table name is Department (not Departments)
export class Department {
  @PrimaryGeneratedColumn()
  dept_id: number;

  @Column()
  department_name: string;

  @OneToMany(() => User, (user) => user.department)
  users: User[]; // ✅ enables department.users[]
}
