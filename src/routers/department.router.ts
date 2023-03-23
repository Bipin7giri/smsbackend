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
router.get("/hod/department", tokenValidation, HODAuthorization, get);
router.get(
  "/hod/department/student",
  tokenValidation,
  HODAuthorization,
  getStudent
);

router.get(
  "/admin/department/count",
  tokenValidation,
  AdminAuthorization,
  countDepartment
);
router.get("/department", AdminAuthorization, getAllDepartment);
router.post("/department/notification", HODAuthorization, createNotification);
router.get("/department/notification", HODAuthorization, getNotification);

router.post(
  "/hod/addBulkStudent",
  HODAuthorization,
  upload.single("students"),
  addBulkStudent
);

router.delete("/admin/department/:departmentId", AdminAuthorization, remove);
export default router;
