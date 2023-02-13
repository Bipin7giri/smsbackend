/**
 * @swagger
 * tags:
 *   name: Roles
 *   description: The books managing API
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

import { addStudent, create, get } from "../controllers/class.controller";
import * as express from "express";
import {
  AdminAuthorization,
  HODAuthorization,
  TeacherAuthorization,
  tokenValidation,
} from "../helper/jwt";
const router = express.Router();

router.post("/hod/class", tokenValidation, HODAuthorization, create);
router.get("/teacher/class", tokenValidation, TeacherAuthorization, get);
router.post(
  "/teacher/class",
  tokenValidation,
  TeacherAuthorization,
  addStudent
);
export default router;
