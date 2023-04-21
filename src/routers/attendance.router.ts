import {
  create,
  get,
  getAttendanceReportByStudentId,
} from "../controllers/attendance.controllert";
import * as express from "express";
import {
  AdminAuthorization,
  HODAuthorization,
  StudentAuthorization,
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
  TeacherAuthorization,
  getAttendanceReportByStudentId
);

// router.get(
//   "test/:id",
//   tokenValidation,
//   // TeacherAuthorization,
//   getAttendanceReportByStudentId
// );
export default router;
