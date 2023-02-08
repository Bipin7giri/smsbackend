"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var auth_controller_1 = require("../controllers/auth.controller");
var express = require("express");
var jwt_1 = require("../helper/jwt");
var router = express.Router();
var multer = require("multer");
var upload = multer({ dest: 'uploads/' });
router.post('/register', auth_controller_1.register);
router.post('/login', auth_controller_1.login);
// router.patch('/users/me', tokenValidation, updateUser)
router.get('/users/me', jwt_1.tokenValidation, auth_controller_1.getUser);
router.patch('/users/me', jwt_1.tokenValidation, upload.single("avatar"), auth_controller_1.updateUser);
// router.get('/users/all',tokenValidation,Authorization, getAllUsers)
// router.put("/edithod/:user_name",editHOD)
// module.exports = router
exports.default = router;
//# sourceMappingURL=auth.router.js.map