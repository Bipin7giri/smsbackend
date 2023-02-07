import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne, ManyToOne, OneToMany } from "typeorm"
import { Subject } from "typeorm/persistence/Subject"
import { Class } from "./Classes"
import { Department } from "./Department"
import { SoftDelete } from "./SoftDelete"
import { Subjects } from "./Subject"
import { User } from "./User"


@Entity()
export class Semester extends SoftDelete {

    @PrimaryGeneratedColumn()
    id: number

    @Column({nullable:true})
    name?: string
     
    // @ManyToOne(() => User, (user) => user.semester_id)
    // @JoinColumn({name:'student_id'})
    // studentId: User


   
    @OneToMany(() => Subjects,(sub)=>sub.semesterId)
    subjects: Subjects[]   
    
    @OneToMany(() => Class,(c)=>c.semesterId)
    classes: Class[]
    
    @ManyToOne(() => Department, (dep) => dep.semesterId)
    @JoinColumn({name:'department_id'})
    departmentId: Department

}