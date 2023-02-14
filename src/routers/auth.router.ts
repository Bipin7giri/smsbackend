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

import {
  register,
  login,
  getUser,
  updateUser,
} from "../controllers/auth.controller";
import * as express from "express";
import { tokenValidation } from "../helper/jwt";
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
router.post("/register", register);
router.post("/login", login);
router.get("/users/me", tokenValidation, getUser);
router.patch("/users/me", tokenValidation, upload.single("avatar"), updateUser);
export default router;
