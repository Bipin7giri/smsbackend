import { create, get } from "../controllers/notes.controller";
import * as express from "express";
import {
  StudentAuthorization,
  TeacherAuthorization,
  tokenValidation,
} from "../helper/jwt";
import { getAllAssignment } from "../controllers/assignment.controller";
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
router.post(
  "/teacher/note",
  tokenValidation,
  TeacherAuthorization,
  upload.single("note"),
  create
);

router.get(
  "/student/note/:subjectId",
  tokenValidation,
  StudentAuthorization,
  get
);

router.get(
  "/student/notes/",
  tokenValidation,
  // StudentAuthorization,
  getAllAssignment
);

export default router;
