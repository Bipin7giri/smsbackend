import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  OneToOne,
  OneToMany,
  ManyToOne,
} from "typeorm";
import { Semester } from "./Semester";
import { SoftDelete } from "./SoftDelete";
import { User } from "./User";
import {Notification} from "./Notification";

@Entity()
export class Department extends SoftDelete {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  name?: string;

  @Column("text", { array: true, nullable: true })
  teachers: string[];

  @OneToMany(() => Semester, (sem) => sem.departmentId)
  semesterId: Semester[];

  @OneToMany(() => User, (user) => user.departmentId)
  userId: User[];

  @ManyToOne(() => User, (user) => user.hod)
  @JoinColumn({ name: "hod_id" })
  hod: User;


  @OneToMany(() => Notification,(notification)=>notification.departmentId)
  notificationID: Notification[]
}
