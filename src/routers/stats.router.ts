import { countStatus, getAssigmnmentReportAndAttendanceReports, studentAccDepartment, studentAccSemester } from "../controllers/stats.controller";
import * as express from "express";
import {
    StudentAuthorization,
    TeacherAuthorization,
    tokenValidation,
} from "../helper/jwt";
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.get(
    "/department/users",
    studentAccDepartment
);
router.get(
    "/semester/users",
    studentAccSemester
);
router.get("/count",countStatus)

router.get("/average_reports",tokenValidation,getAssigmnmentReportAndAttendanceReports)
export default router;

