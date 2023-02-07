import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany } from "typeorm"
import { Class } from "./Classes"
import { Department } from "./Department"
import { Semester } from "./Semester"
import { SoftDelete } from "./SoftDelete"
import { User } from "./User"


@Entity()
export class Subjects extends SoftDelete {

    @PrimaryGeneratedColumn()
    id: number
    
    @Column()
    subject_name: string
    
    @OneToOne(()=>User)
    @JoinColumn({name:"teacher_id"})
    teacherId:User
    
    @ManyToOne(()=>Semester, (sem)=>sem)
    @JoinColumn({name:"semester_id"})
    semesterId:Semester

    @OneToMany(() => Class, (c) =>c.subjectId)
    classId: Class[]

}