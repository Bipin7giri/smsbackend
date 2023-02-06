import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne, ManyToOne, OneToMany } from "typeorm"
import { Department } from "./Department"
import { SoftDelete } from "./SoftDelete"
import { User } from "./User"


@Entity()
export class Semester extends SoftDelete {

    @PrimaryGeneratedColumn()
    id: number

    @Column({nullable:true})
    name?: string
     
    @ManyToOne(() => User, (user) => user.semester_id)
    @JoinColumn({name:'student_id'})
    studentId: User
        
    
    @ManyToOne(() => Department, (dep) => dep.semesterId)
    @JoinColumn({name:'department_id'})
    departmentId: Department

}