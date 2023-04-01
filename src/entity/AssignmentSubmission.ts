import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  OneToOne,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Subject } from "typeorm/persistence/Subject";
import { Assignment } from "./Assignment";
import { Department } from "./Department";
import { Semester } from "./Semester";
import { SoftDelete } from "./SoftDelete";
import { Subjects } from "./Subject";
import { User } from "./User";

@Entity()
export class AssignmentSubmission extends SoftDelete {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  submission?: string;

  @ManyToOne(() => Assignment, (sub) => sub.assignemtSubmission)
  @JoinColumn({ name: "assignment_id" })
  assigmnmentId: Assignment;

  @ManyToOne(() => User, (user) => user.classes)
  @JoinColumn({ name: "student_id" })
  studentId: User;
}
