import {
  register,
  login,
  getUser,
  updateUser,
  forgetPassword,
  resetPassword,
} from "../controllers/auth.controller";
import * as express from "express";
import { tokenValidation } from "../helper/jwt";
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
router.post("/register", register);

router.post("/login", login);
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

router.patch("/users/me", tokenValidation, upload.single("avatar"), updateUser);
export default router;
