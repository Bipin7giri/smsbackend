import { Entity, PrimaryGeneratedColumn, Column,UpdateDateColumn, CreateDateColumn, DeleteDateColumn } from "typeorm"
import { SoftDelete } from "./SoftDelete";

@Entity()
export class Role extends SoftDelete {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column("text", { array: true })
    roles: string[];

    
}