import { create, get} from "../controllers/chat.controller";
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
  "/chat",
  tokenValidation,
//   upload.single("assignment"),
  create
);

router.get("/chat/users",tokenValidation,get)

// router.post(
//     "/student/assignment",
//     tokenValidation,
//     StudentAuthorization,
//     upload.single("submission"),
//     submitAssigment
//   );

// router.get(
//     "/student/assignment/:subjectId",
//     tokenValidation,
//     StudentAuthorization,
//     get
//   );

export default router;
