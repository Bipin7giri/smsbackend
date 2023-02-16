/**
 * @swagger
 * /teacher/class/:
 *   get:
 *     summary: Get a Class
 *     tags: [Classes]
 *     responses:
 *       200:
 *         description: The get all students.
 *       500:
 *         description: Some server error
 *
 */

import {
  addStudent,
  create,
  get,
  joinClassRoom,
} from "../controllers/class.controller";
import * as express from "express";
import {
  AdminAuthorization,
  HODAuthorization,
  StudentAuthorization,
  TeacherAuthorization,
  tokenValidation,
} from "../helper/jwt";
const router = express.Router();

router.post("/hod/class", tokenValidation, HODAuthorization, create);
router.post(
  "/student/class",
  tokenValidation,
  StudentAuthorization,
  joinClassRoom
);

router.get("/teacher/class", tokenValidation, TeacherAuthorization, get);
router.post(
  "/teacher/class",
  tokenValidation,
  TeacherAuthorization,
  addStudent
);
export default router;
