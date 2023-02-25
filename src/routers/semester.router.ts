import {
  addBulkStudent,
  create,
  get,
  getSemesterStudent,
} from "../controllers/semester.controller";
import * as express from "express";
import {
  AdminAuthorization,
  HODAuthorization,
  StudentAuthorization,
  TeacherAuthorization,
  tokenValidation,
} from "../helper/jwt";
import { addTeacher } from "../controllers/semester.controller";
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
router.post("/hod/semester", tokenValidation, HODAuthorization, create);
router.post(
  "/hod/semester/addTeacher/:semester",
  tokenValidation,
  HODAuthorization,
  addTeacher
);
router.post(
  "/hod/semester/bulk-student",
  tokenValidation,
  TeacherAuthorization,
  upload.single("students"),
  addBulkStudent
);
router.get("/student/semester", tokenValidation, StudentAuthorization,getSemesterStudent);

router.get("/hod/semester", tokenValidation, HODAuthorization, get);

//   router.post('/login',login)
// router.patch('/users/me', tokenValidation,upload.single("avatar"), update)
//   router.get('/users/me',tokenValidation,getUser)
// router.get('/users/all',tokenValidation,Authorization, getAllUsers)
// router.put("/edithod/:user_name",editHOD)
// module.exports = router
export default router;
