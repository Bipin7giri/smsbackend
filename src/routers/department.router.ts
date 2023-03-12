import {
  addBulkStudent,
  countDepartment,
  create,
  get,
  getAllDepartment,
  getStudent,
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
router.post(
  "/hod/addBulkStudent",
  HODAuthorization,
  upload.single("students"),
  addBulkStudent
);
// router.patch('/users/me', tokenValidation,upload.single("avatar"), update)
//   router.get('/users/me',tokenValidation,getUser)
// router.get('/users/all',tokenValidation,Authorization, getAllUsers)
// router.put("/edithod/:user_name",editHOD)
// module.exports = router
export default router;
