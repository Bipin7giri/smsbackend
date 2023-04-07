import { create, get } from "../controllers/attendance.controllert";
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

export default router;
