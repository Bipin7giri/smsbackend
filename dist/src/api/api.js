"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var router = require("express").Router();
var auth_router_1 = require("../routers/auth.router");
var role_router_1 = require("../routers/role.router");
var department_router_1 = require("../routers/department.router");
var semester_router_1 = require("../routers/semester.router");
var class_router_1 = require("../routers/class.router");
var subject_router_1 = require("../routers/subject.router");
router.use("/auth", auth_router_1.default);
router.use("/", role_router_1.default);
router.use('/', department_router_1.default);
router.use('/', semester_router_1.default);
router.use('/', class_router_1.default);
router.use('/', subject_router_1.default);
exports.default = router;
//# sourceMappingURL=api.js.map