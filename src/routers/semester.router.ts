import { create, get } from "../controllers/semester.controller";
import * as express from 'express'
import { AdminAuthorization, HODAuthorization, tokenValidation } from "../helper/jwt";
import { addTeacher } from "../controllers/semester.controller";
const   router = express.Router();
router.post('/hod/semester', tokenValidation,HODAuthorization, create);
router.post('/hod/semester/addTeacher/:semester', tokenValidation,HODAuthorization, addTeacher);

router.get('/hod/semester', tokenValidation,HODAuthorization, get);

//   router.post('/login',login)
  // router.patch('/users/me', tokenValidation,upload.single("avatar"), update)
//   router.get('/users/me',tokenValidation,getUser)
  // router.get('/users/all',tokenValidation,Authorization, getAllUsers)
// router.put("/edithod/:user_name",editHOD)
// module.exports = router
export default router;