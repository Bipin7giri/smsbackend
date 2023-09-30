import { binarySearchAlgo, binarySearchAlgoForTeacher, countStatus, getAssigmnmentReportAndAttendanceReports, studentAccDepartment, studentAccSemester } from "../controllers/stats.controller";
import * as express from "express";
import {
    TeacherAuthorization,
    tokenValidation,
} from "../helper/jwt";
const router = express.Router();

router.get(
    "/department/users",
    studentAccDepartment
);
router.get(
    "/semester/users",
    studentAccSemester
);
router.get("/count",countStatus)
router.get("/binarySearch",binarySearchAlgo)
router.get("/binarysearchforteacher",tokenValidation,TeacherAuthorization,binarySearchAlgoForTeacher)
router.get("/average_reports",tokenValidation,getAssigmnmentReportAndAttendanceReports)
export default router;

