"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var role_controller_1 = require("../controllers/role.controller");
var express = require("express");
var jwt_1 = require("../helper/jwt");
var router = express.Router();
router.post("/role", jwt_1.tokenValidation, jwt_1.AdminAuthorization, role_controller_1.create);
//   router.post('/login',login)
// router.patch('/users/me', tokenValidation,upload.single("avatar"), update)
//   router.get('/users/me',tokenValidation,getUser)
// router.get('/users/all',tokenValidation,Authorization, getAllUsers)
// router.put("/edithod/:user_name",editHOD)
// module.exports = router
exports.default = router;
//# sourceMappingURL=role.router.js.map