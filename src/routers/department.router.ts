import {
  countDepartment,
  create,
  get,
  getAllDepartment,
} from "../controllers/department.controller";
import * as express from "express";
import {
  AdminAuthorization,
  HODAuthorization,
  tokenValidation,
} from "../helper/jwt";
import { count } from "console";
const router = express.Router();
router.post("/department", tokenValidation, AdminAuthorization, create);
router.get("/hod/department", tokenValidation, HODAuthorization, get);
router.get(
  "/admin/department/count",
  tokenValidation,
  AdminAuthorization,
  countDepartment
);
router.get("/login/department", getAllDepartment);

// router.patch('/users/me', tokenValidation,upload.single("avatar"), update)
//   router.get('/users/me',tokenValidation,getUser)
// router.get('/users/all',tokenValidation,Authorization, getAllUsers)
// router.put("/edithod/:user_name",editHOD)
// module.exports = router
export default router;
