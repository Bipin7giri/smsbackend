"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
var auth_controller_1 = require("../controllers/auth.controller");
var express = require("express");
var jwt_1 = require("../helper/jwt");
var router = express.Router();
var multer = require("multer");
var upload = multer({ dest: "uploads/" });
router.post("/register", auth_controller_1.register);
router.post("/login", auth_controller_1.login);
router.get("/users/me", jwt_1.tokenValidation, auth_controller_1.getUser);
router.patch("/users/me", jwt_1.tokenValidation, upload.single("avatar"), auth_controller_1.updateUser);
exports.default = router;
//# sourceMappingURL=auth.router.js.map