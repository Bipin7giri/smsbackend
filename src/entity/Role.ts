import { Entity, PrimaryGeneratedColumn, Column,UpdateDateColumn, CreateDateColumn, DeleteDateColumn, OneToMany } from "typeorm"
import { SoftDelete } from "./SoftDelete";
import { User } from "./User";

@Entity()
export class Role extends SoftDelete {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name?: string

    @Column("text", { array: true })
    roles: string[];

    @OneToMany(() => User,(user)=>user.roleId)
    userId: User[]
}