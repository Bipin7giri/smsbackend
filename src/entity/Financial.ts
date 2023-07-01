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
import { FinancialHistory } from "./FinancialHistory";

@Entity()
export class Financial extends SoftDelete {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "total_amount" })
  totalAmount: Number;

  @ManyToOne(() => User, (user) => user.financial)
  @JoinColumn({ name: "student_id" })
  studentId: User;

  @Column({
    name: "dead_line",
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
  })
  deadLine!: Date;

  @OneToMany(() => FinancialHistory, (f) => f.financialId)
  financialHistoryId: FinancialHistory;
}
