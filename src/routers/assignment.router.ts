import {
  create,
  get,
  getAllAssignment,
  getPdf,
  getSubmitedAssignemnt,
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
  upload.single("assignment"),
  create
);

router.get("/getpdf", getPdf);
router.post(
  "/student/assignment/:assignmentId",
  tokenValidation,
  StudentAuthorization,
  upload.single("submission"),
  submitAssigment
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

export default router;
