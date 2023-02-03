import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from "typeorm"
import { Role } from "./Role"
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

    @OneToOne(({}) => Role)
    @JoinColumn({name: 'role_id'})
    roleId: Role
}
