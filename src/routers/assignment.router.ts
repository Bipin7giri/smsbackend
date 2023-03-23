import {
  create,
  get,
  getPdf,
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
  "/student/assignment",
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

export default router;
