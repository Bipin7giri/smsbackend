// import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne } from "typeorm"
// import { SoftDelete } from "./SoftDelete"
// import { User } from "./User"


// @Entity()
// export class Semester extends SoftDelete {

//     @PrimaryGeneratedColumn()
//     id?: number

//     @Column()
//     name?: string

//     @OneToOne(() => User)
//     @JoinColumn({name: 'student_id'})
//     studentId: User

// }