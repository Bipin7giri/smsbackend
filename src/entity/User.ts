import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, OneToMany } from "typeorm"
import { Class } from "./Classes"
import { Department } from "./Department"
import { Role } from "./Role"
import { Semester } from "./Semester"
import { SoftDelete } from "./SoftDelete"
import { TimeStamp } from "./TimeStamp"


@Entity()
export class User extends SoftDelete {

    @PrimaryGeneratedColumn()
    id?: number

    @Column({nullable:true})
    firstName?: string

    @Column({nullable:true})
    lastName?: string

    @Column({ unique: true })
    email: string

    @Column({name:'phone_number',nullable:true})
    phoneNumber?: string
  
    
    @Column()
    password: string 

    @Column({nullable:true})
    address?:string

    // @OneToOne(({}) => Role)
    // @JoinColumn({name: 'role_id'})
    // roleId: Role

    @ManyToOne(() => Role, (role) => role.userId)
    @JoinColumn({name:'role_id'})
    roleId: Role

    @OneToMany(() => Class,(c)=>c.studentId)
    classes: Class[]

    @OneToMany(() => Department,(dep)=>dep.hod)
    hod: Department[]
}

