import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
} from "typeorm";
import { SoftDelete } from "./SoftDelete";
import { Subjects } from "./Subject";
@Entity()
export class Meeting extends SoftDelete {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true, name: "join_url" })
  joinUrl?: string;

  @Column({ nullable: true, name: "start_url" })
  startUrl?: string;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  password: string;

  @ManyToOne(() => Subjects, (sub) => sub.noteId)
  @JoinColumn({ name: "subject_id" })
  subjectId: Subjects;
}
