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
import { Financial } from "./Financial";

@Entity()
export class FinancialHistory extends SoftDelete {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "paid_amount" })
  paidAmount: Number;

  @Column({ name: "transaction_id", nullable: true })
  transcationId: String;

  @Column({ name: "payment_status", nullable: true })
  paymentStatus: PaymentStatus;

  @ManyToOne(() => Financial, (f) => f.financialHistoryId)
  @JoinColumn({ name: "financial_id" })
  financialId: Financial;
}
