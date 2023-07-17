import {
  addBulkStudent,
  countDepartment,
  create,
  createNotification,
  get,
  getAllDepartment,
  getNotification,
  getStudent,
  remove,
} from "../controllers/department.controller";
import * as express from "express";
import {
  AdminAuthorization,
  HODAuthorization,
  tokenValidation,
} from "../helper/jwt";
import { count } from "console";
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.post("/department", tokenValidation, AdminAuthorization, create);
/**
 * @swagger
 * /department:
 *   post:
 *     tags: [Department]
 *     summary: Departments
 *     consumes: application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *             password:
 *                type: string
 *             email:
 *                type: string
 *     responses:
 *       201:
 *         description: Created
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */

router.get("/hod/department", tokenValidation, HODAuthorization, get);

/**
 * @swagger
 * /hod/department:
 *   get:
 *     summary: Get department info
 *     tags: [Department]
 *     responses:
 *       200:
 *         description: The get all students.
 *       500:
 *         description: Some server error
 */
router.get(
  "/hod/department/student",
  tokenValidation,
  HODAuthorization,
  getStudent
);

/**
 * @swagger
 * /hod/department/student:
 *   get:
 *     summary: Get student of particular department info
 *     tags: [Department]
 *     responses:
 *       200:
 *         description: The get all students.
 *       500:
 *         description: Some server error
 */

router.get(
  "/admin/department/count",
  tokenValidation,
  AdminAuthorization,
  countDepartment
);

/**
 * @swagger
 * /admin/department/count:
 *   get:
 *     summary: Get number of student of particular department
 *     tags: [Department]
 *     responses:
 *       200:
 *         description: The get all students.
 *       500:
 *         description: Some server error
 */

router.get("/department", AdminAuthorization, getAllDepartment);

/**
 * @swagger
 * /department:
 *   get:
 *     summary: Get department
 *     tags: [Department]
 *     responses:
 *       200:
 *         description: The get all students.
 *       500:
 *         description: Some server error
 */
router.post("/department/notification", HODAuthorization, createNotification);
router.get("/department/notification", getNotification);
/**
 * @swagger
 * /department/notification:
 *   get:
 *     summary: Get notification list of  particular department
 *     tags: [Department]
 *     responses:
 *       200:
 *         description: The get all students.
 *       500:
 *         description: Some server error
 */
router.post(
  "/hod/addBulkStudent",
  HODAuthorization,
  upload.single("students"),
  addBulkStudent
);

router.delete("/admin/department/:departmentId", AdminAuthorization, remove);
export default router;
