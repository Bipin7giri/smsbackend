import {
  register,
  getUser,
  updateUser,
  forgetPassword,
  resetPassword,
  getAllUsers,
  updateUserRole,
  blockUser,
  viewBlockUser,
  verifyEmail,
  unBlockUser,
  adminlogin,
  hodLogin,
  studentLogin,
  login,
} from "../controllers/auth.controller";
import * as express from "express";
import { AdminAuthorization, tokenValidation } from "../helper/jwt";
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
router.post("/register", register);
/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Login
 *     consumes: application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         schema:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *             password:
 *                type: string
 *     responses:
 *       201:
 *         description: Created
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */

router.post("/admin/login", adminlogin);
/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login
 *     consumes: application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         schema:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *             password:
 *                type: string
 *     responses:
 *       201:
 *         description: Created
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */

router.post("/forget-password", forgetPassword);
/**
 * @swagger
 * /auth/forget-password:
 *   post:
 *     tags: [Auth]
 *     summary: forgetpassword
 *     consumes: application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         schema:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *     responses:
 *       201:
 *         description: Created
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */

router.post("/reset-password", resetPassword);

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     tags: [Auth]
 *     summary: forgetpassword
 *     consumes: application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         schema:
 *           type: object
 *           properties:
 *             otp:
 *               type: string
 *             password:
 *               type: string
 *     responses:
 *       201:
 *         description: Created
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */

router.get("/users/me", tokenValidation, getUser);

/**
 * @swagger
 * /auth/users/me:
 *   get:
 *     summary: Get user info
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: The get all students.
 *       500:
 *         description: Some server error
 */

router.post("/hod/login", hodLogin);
router.post("/login", login);
// router.post("/teacher/login", teacherLogin);

router.patch("/users/me", tokenValidation, upload.single("avatar"), updateUser);

router.get("/allusers", tokenValidation, getAllUsers);

router.patch(
  "/users-roles",
  tokenValidation,
  AdminAuthorization,
  updateUserRole
);

router.patch("/blockuser", tokenValidation, AdminAuthorization, blockUser);
router.patch("/unblockuser", tokenValidation, AdminAuthorization, unBlockUser);

router.get("/blockuser", tokenValidation, AdminAuthorization, viewBlockUser);

router.post("/email/verification", verifyEmail);

export default router;
