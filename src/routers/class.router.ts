import { create } from "../controllers/class.controller";
import * as express from 'express'
import { AdminAuthorization, HODAuthorization, tokenValidation } from "../helper/jwt";
const   router = express.Router();
router.post('/hod/class', tokenValidation,HODAuthorization, create);
// router.get('/hod/class', tokenValidation,HODAuthorization, get);

//   router.post('/login',login)
  // router.patch('/users/me', tokenValidation,upload.single("avatar"), update)
//   router.get('/users/me',tokenValidation,getUser)
  // router.get('/users/all',tokenValidation,Authorization, getAllUsers)
// router.put("/edithod/:user_name",editHOD)
// module.exports = router
export default router;