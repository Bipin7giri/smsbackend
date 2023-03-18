import {create, get, remove} from "../controllers/role.controller";
import * as express from "express";
import { AdminAuthorization, tokenValidation } from "../helper/jwt";

const router = express.Router();
router.post("/role", tokenValidation, create);
router.get("/role", tokenValidation, get);
router.delete("/role", tokenValidation, remove);
//   router.post('/login',login)
// router.patch('/users/me', tokenValidation,upload.single("avatar"), update)
//   router.get('/users/me',tokenValidation,getUser)
// router.get('/users/all',tokenValidation,Authorization, getAllUsers)
// router.put("/edithod/:user_name",editHOD)
// module.exports = router
export default router;
