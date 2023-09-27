import {
  create,
  get,
  getAttendanceReportByStudentId,
  getByDate,
} from "../controllers/attendance.controllert";
import * as express from "express";
import {
  TeacherAuthorization,
  tokenValidation,
} from "../helper/jwt";
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
router.post("/attendance", tokenValidation, TeacherAuthorization, create);
router.get("/attendance", tokenValidation, TeacherAuthorization, get);
router.get(
  "/attendance/reports/:studentId",
  tokenValidation,
  getAttendanceReportByStudentId
);
router.post(
  "/attendancebydate",
  tokenValidation,
  TeacherAuthorization,
  getByDate
);

// router.get(
//   "test/:id",
//   tokenValidation,
//   // TeacherAuthorization,
//   getAttendanceReportByStudentId
// );
export default router;
