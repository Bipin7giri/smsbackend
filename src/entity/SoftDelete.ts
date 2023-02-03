import { Entity, PrimaryGeneratedColumn, Column, DeleteDateColumn } from "typeorm"
import { TimeStamp } from "./TimeStamp"

@Entity()
export class SoftDelete extends TimeStamp {

    @Column({nullable:true})
    deletedBy?:string

    @Column({nullable:true})
    deleted?: boolean

    @DeleteDateColumn({name:'deleted_at',nullable:true})
    deletedAt?:Date

}