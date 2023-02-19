"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var auth_controller_1 = require("../controllers/auth.controller");
var express = require("express");
var jwt_1 = require("../helper/jwt");
var router = express.Router();
var multer = require("multer");
var upload = multer({ dest: "uploads/" });
router.post("/register", auth_controller_1.register);
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
router.post("/login", auth_controller_1.login);
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
router.post("/forget-password", auth_controller_1.forgetPassword);
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
router.post("/reset-password", auth_controller_1.resetPassword);
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
router.get("/users/me", jwt_1.tokenValidation, auth_controller_1.getUser);
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
router.patch("/users/me", jwt_1.tokenValidation, upload.single("avatar"), auth_controller_1.updateUser);
router.get("/allusers", jwt_1.tokenValidation, jwt_1.AdminAuthorization, auth_controller_1.getAllUsers);
exports.default = router;
//# sourceMappingURL=auth.router.js.map