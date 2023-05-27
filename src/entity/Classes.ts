import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne, ManyToOne, OneToMany } from "typeorm"
import { Subject } from "typeorm/persistence/Subject"
import { Department } from "./Department"
import { Semester } from "./Semester"
import { SoftDelete } from "./SoftDelete"
import { Subjects } from "./Subject"
import { User } from "./User"


@Entity()
export class Class extends SoftDelete {

    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => User, (user) => user.classes)
    @JoinColumn({name:'student_id'})
    studentId: User

    @ManyToOne(() => Subjects, (sub) => sub.classId)
    @JoinColumn({name:'subject_id'})
    subjectId: Subjects

    @ManyToOne(() => Semester, (sem) => sem.classes)
    @JoinColumn({name:'semester_id'})
    semesterId: Semester

}