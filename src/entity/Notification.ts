import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne, ManyToOne, OneToMany } from "typeorm"
import { SoftDelete } from "./SoftDelete"

@Entity()
export class Notification extends SoftDelete {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    title:string

    @Column()
    body:string

}