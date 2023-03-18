import { create,get } from "../controllers/notes.controller";
import * as express from "express";
import {
    StudentAuthorization,
    TeacherAuthorization,
    tokenValidation,
} from "../helper/jwt";
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

export default router;
