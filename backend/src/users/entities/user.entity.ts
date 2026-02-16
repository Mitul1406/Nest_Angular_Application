import { Role } from 'src/common/enum/role.enum';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { Task } from 'src/tasks/entities/task.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

@Column({ type: 'varchar', nullable: true })
otp: string | null;

@Column({ type: 'timestamp', nullable: true })
otpExpiry: Date | null;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.USER,
  })
  role: Role;

  @Column({type:"varchar", nullable: true })
  refreshToken: string | null;

  @OneToMany(() => Task, (task) => task.user)
  tasks: Task[];
}