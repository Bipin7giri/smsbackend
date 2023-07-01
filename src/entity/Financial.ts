import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  OneToOne,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { SoftDelete } from "./SoftDelete";
import { Role } from "./Role";
import { Department } from "./Department";
import { User } from "./User";
import { PaymentStatus } from "../ENUMS/PaymentEnum";

@Entity()
export class Financial extends SoftDelete {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "total_amount" })
  totalAmount: Number;

  @Column({ name: "clear_amount" })
  clearAmount: Number;

  @Column({ name: "payment_status",nullable:true })
  paymentStatus: PaymentStatus;

  @Column({ name: "transaction_id",nullable:true })
  transcationId: String;

  @ManyToOne(() => User, (user) => user.financial)
  @JoinColumn({ name: "student_id" })
  studentId: User;

  @Column({
    name: "dead_line",
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
  })
  deadLine!: Date;

}
