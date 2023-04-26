import {
  createAssignment,
  get,
  getAllAssignment,
  getAssigmnmentReport,
  getAssigmnmentReportForTeacher,
  getAssignmentListTeacher,
  getPdf,
  getSubmitedAssignemnt,
  rateSubmitedAssignment,
  submitAssigment,
} from "../controllers/assignment.controller";
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
router.post(
  "/teacher/assignment",
  tokenValidation,
  TeacherAuthorization,
  upload.single("note"),
  createAssignment
);

router.get("/getpdf", getPdf);
router.post(
  "/student/assignment/:assignmentId",
  tokenValidation,
  StudentAuthorization,
  upload.single("submission"),
  submitAssigment
);

// rate assignment

router.patch(
  "/teacher/rateassignment",
  tokenValidation,
  TeacherAuthorization,
  rateSubmitedAssignment
);

router.get(
  "/student/assignment/:subjectId",
  tokenValidation,
  StudentAuthorization,
  get
);

router.get(
  "/student/assignment/",
  tokenValidation,
  // StudentAuthorization,
  getAllAssignment
);
router.get(
  "/teacher/assignmentsubmited/:subjectId",
  tokenValidation,
  // StudentAuthorization,
  getSubmitedAssignemnt
);

// get assignmentReports
// router.get(
//   "/assignment/reports/:studentId",
//   tokenValidation,
//   // StudentAuthorization,
//   getAssigmnmentReport
// );

// for student
router.post(
  "/assignment/reports/",
  tokenValidation,
  // StudentAuthorization,
  getAssigmnmentReport
);

//for teacher

router.get(
  "/teacher/assignment/reports/:studentId",
  tokenValidation,
  TeacherAuthorization,
  getAssigmnmentReportForTeacher
);

// getAssignmentListTeacher

router.get(
  "/teacher/assignment",
  tokenValidation,
  TeacherAuthorization,
  getAssignmentListTeacher
);

export default router;
