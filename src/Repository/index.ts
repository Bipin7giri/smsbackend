import { Repository } from "typeorm";
import { AppDataSource } from "../PGDB/data-source";
import { Absent } from "../entity/Absent";
import { Assignment } from "../entity/Assignment";
import { AssignmentSubmission } from "../entity/AssignmentSubmission";
import { Class } from "../entity/Classes";
import { Department } from "../entity/Department";
import { Financial } from "../entity/Financial";
import { FinancialHistory } from "../entity/FinancialHistory";
import { Meeting } from "../entity/Meeting";
import { Notes } from "../entity/Notes";
import { Notification } from "../entity/Notification";
import { Reports } from "../entity/Reports";
import { Role } from "../entity/Role";
import { Semester } from "../entity/Semester";
import { Subjects } from "../entity/Subject";
import { User } from "../entity/User";
import { Present } from "../entity/Present";

export const departmentRepo = AppDataSource.getRepository(Department);
export const userRepo = AppDataSource.getRepository(User);
export const notificationRepo = AppDataSource.getRepository(Notification);
export const assigmnmentRepo = AppDataSource.getRepository(Assignment);
export const subjectRepo = AppDataSource.getRepository(Subjects);
export const assigmnmentSubmitRepo = AppDataSource.getRepository(AssignmentSubmission);
export const classRepo = AppDataSource.getRepository(Class);
export const reportsRepo = AppDataSource.getRepository(Reports);
export const meetingRepo  = AppDataSource.getRepository(Meeting)
export const semseterRepo = AppDataSource.getRepository(Semester);
export const repo = AppDataSource.getRepository(Role);
export const noteRepo = AppDataSource.getRepository(Notes);
export const financialRepo = AppDataSource.getRepository(Financial);
export const financialHistoryRepo = AppDataSource.getRepository(FinancialHistory);

export const absentRepo: Repository<Absent> = AppDataSource.getRepository(Absent);
export const presentRepo: Repository<Present> = AppDataSource.getRepository(Present);