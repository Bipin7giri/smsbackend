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
export class Notes extends SoftDelete {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    pdf?: string;

    @Column({ nullable: true })
    word?: string;

    @ManyToOne(() => Subjects, (sub) => sub.noteId)
    @JoinColumn({ name: "subject_id" })
    subjectId: Subjects;

}
