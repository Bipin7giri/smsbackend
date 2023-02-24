import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  OneToOne,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Reports } from "./Reports";
import { SoftDelete } from "./SoftDelete";
import { Subjects } from "./Subject";
import { User } from "./User";

@Entity()
export class Absent extends SoftDelete {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.classes)
  @JoinColumn({ name: "student_id" })
  studentId: User;

  @ManyToOne(() => Subjects, (sub) => sub.classId)
  @JoinColumn({ name: "subject_id" })
  subjectId: Subjects;

  @OneToMany(() => Reports, (r) => r.presentId)
  reports: Reports[];

}
