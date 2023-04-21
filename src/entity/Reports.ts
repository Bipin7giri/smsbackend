import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  OneToOne,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Absent } from "./Absent";
import { Present } from "./Present";
import { Semester } from "./Semester";
import { SoftDelete } from "./SoftDelete";
import { Subjects } from "./Subject";
import { User } from "./User";

@Entity()
export class Reports extends SoftDelete {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Semester, (s) => s.reports)
  @JoinColumn({ name: "semester_id" })
  semesterId: Semester;

  @ManyToOne(() => Present, (p) => p.reports)
  @JoinColumn({ name: "present_id" })
  presentId: Present;

  @ManyToOne(() => Absent, (a) => a.reports)
  @JoinColumn({ name: "absent_id" })
  absentId: Absent;

  @ManyToOne(() => Subjects, (sub) => sub.reports)
  @JoinColumn({ name: "subject_id" })
  subjectId: Subjects;

  @ManyToOne(() => User, (user) => user.reports)
  @JoinColumn({ name: "student_id" })
  studentId: User;

  // @Column({ name: "total_absent" })
  // totalAbsent:Number;
}
