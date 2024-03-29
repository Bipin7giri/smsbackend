import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  OneToOne,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { AssignmentSubmission } from "./AssignmentSubmission";
import { SoftDelete } from "./SoftDelete";
import { Subjects } from "./Subject";

@Entity()
export class Assignment extends SoftDelete {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  pdf?: string;

  @Column({ nullable: true })
  word?: string;

  @Column({ nullable: true })
  title?: string;
  @Column({
    name: "dead_line",
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
  })
  deadLine!: Date;

  // @Column({ nullable: true })
  // rating!: string;

  @ManyToOne(() => Subjects, (sub) => sub.assignment)
  @JoinColumn({ name: "subject_id" })
  subjectId: Subjects;

  @OneToMany(() => AssignmentSubmission, (a) => a.assigmnmentId)
  @JoinColumn({ name: "assignement_submission_id" })
  assignemtSubmission: AssignmentSubmission[];
}
