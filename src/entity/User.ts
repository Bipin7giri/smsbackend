import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Absent } from "./Absent";
import { Class } from "./Classes";
import { Department } from "./Department";
import { Present } from "./Present";
import { Reports } from "./Reports";
import { Role } from "./Role";
import { SoftDelete } from "./SoftDelete";
import { Financial } from "./Financial";

@Entity()
export class User extends SoftDelete {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ name: "first_name", nullable: true })
  firstName?: string;

  @Column({ name: "last_name", nullable: true })
  lastName?: string;

  @Column({ unique: true })
  email: string;

  @Column({ name: "phone_number", nullable: true })
  phoneNumber?: string;

  @Column({ nullable: true })
  avatar?: string;

  @Column()
  password: string;

  @Column({ name: "email_opt", nullable: true })
  emailOtp: string;

  @Column({ nullable: true })
  address?: string;

  @Column({ nullable: true, name: "device_id" })
  deviceId?: string;

  @Column({ name: "forget_password", nullable: true })
  forgetPassword?: string;

  @Column({ nullable: true, default: false })
  blocked?: boolean;

  @Column({ nullable: true, name: "is_email_verified", default: false })
  isEmailVerified?: boolean;

  // @OneToOne(({}) => Role)
  // @JoinColumn({name: 'role_id'})
  // roleId: Role

  @ManyToOne(() => Role, (role) => role.userId)
  @JoinColumn({ name: "role_id" })
  roleId: Role;

  @ManyToOne(() => Department, (department) => department.userId)
  @JoinColumn({ name: "department_id" })
  departmentId: Department;

  @OneToMany(() => Class, (c) => c.studentId)
  classes: Class[];

  @OneToMany(() => Present, (p) => p.studentId)
  presnet: Present[];

  @OneToMany(() => Absent, (a) => a.studentId)
  absent: Absent[];

  @OneToMany(() => Reports, (r) => r.studentId)
  reports: Reports[];

  @OneToMany(() => Financial, (f) => f.studentId)
  financial: Financial;

  @OneToMany(() => Department, (dep) => dep.hod)
  hod: Department[];
}
