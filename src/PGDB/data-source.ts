import * as dotenv from "dotenv";
import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../entity/User";
import { Role } from "../entity/Role";
import { Department } from "../entity/Department";
import { Semester } from "../entity/Semester";
import { Class } from "../entity/Classes";
import { Subjects } from "../entity/Subject";
import { Assignment } from "../entity/Assignment";
import { AssignmentSubmission } from "../entity/AssignmentSubmission";
import { Present } from "../entity/Present";
import { Absent } from "../entity/Absent";
import { Reports } from "../entity/Reports";
import {Notification} from "../entity/Notification";
dotenv.config();
export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  synchronize: true,
  logging: false,
  entities: [
    Role,
    User,
    Department,
    Semester,
    Class,
    Subjects,
    Assignment,
    AssignmentSubmission,
    Present,
    Absent,
    Reports,
      Notification
  ],
  migrations: [],
  subscribers: [],
});
