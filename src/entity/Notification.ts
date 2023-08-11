import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne, ManyToOne, OneToMany } from "typeorm"
import { SoftDelete } from "./SoftDelete"
import {Role} from "./Role";
import {Department} from "./Department";
import { Subjects } from "./Subject";

@Entity()
export class Notification extends SoftDelete {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    title:string

    @Column()
    body:string

    @ManyToOne(() => Department, (department) => department.notificationID)
    @JoinColumn({ name: "department_id" })
    departmentId: Department;
    
    @ManyToOne(()=>Subjects,(subject)=>subject.notification)
    @JoinColumn({ name: "subject_id" })
    subjectId: Subjects;
}