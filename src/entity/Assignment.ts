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
import { AssignmentSubmission } from "./AssignmentSubmission";
import { Department } from "./Department";
import { Semester } from "./Semester";
import { SoftDelete } from "./SoftDelete";
import { Subjects } from "./Subject";
import { User } from "./User";

@Entity()
export class Assignment extends SoftDelete {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  pdf?: string;

  @Column({ nullable: true })
  word?: string;

  @Column({
    name: "dead_line",
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
  })
  deadLine!: Date;

  @ManyToOne(() => Subjects, (sub) => sub.assignment)
  @JoinColumn({ name: "subject_id" })
  subjectId: Subjects;

  @OneToMany(() => AssignmentSubmission, (a) => a.assigmnmentId)
  classId: AssignmentSubmission[];
}
