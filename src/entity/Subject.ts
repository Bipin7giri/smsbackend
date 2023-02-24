import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  OneToOne,
  ManyToOne,
  OneToMany,
  ManyToMany,
} from "typeorm";
import { Absent } from "./Absent";
import { Assignment } from "./Assignment";
import { Class } from "./Classes";
import { Department } from "./Department";
import { Present } from "./Present";
import { Reports } from "./Reports";
import { Semester } from "./Semester";
import { SoftDelete } from "./SoftDelete";
import { User } from "./User";

@Entity()
export class Subjects extends SoftDelete {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  subject_name: string;

  @Column({ nullable: true, name: "class_code" })
  classCode?: string;

  @OneToOne(() => User)
  @JoinColumn({ name: "teacher_id" })
  teacherId: User;

  @ManyToOne(() => Semester, (sem) => sem)
  @JoinColumn({ name: "semester_id" })
  semesterId: Semester;

  @OneToMany(() => Class, (c) => c.subjectId)
  classId: Class[];

  @OneToMany(() => Reports, (r) => r.subjectId)
  reports: Reports[];

  @OneToMany(() => Present, (p) => p.subjectId)
    presentId: Present[];

    @OneToMany(() => Absent, (a) => a.subjectId)
    absentId: Absent[];

  @OneToMany(() => Assignment, (a) => a.subjectId)
  assignment: Class[];
}
