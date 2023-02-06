import { register,login,getUser } from "../controllers/auth.controller";
import * as express from 'express'
import { tokenValidation } from "../helper/jwt";
const   router = express.Router();
const multer = require("multer");
const upload = multer({ dest: 'uploads/' });
  router.post('/register',register);
  router.post('/login',login)
  // router.patch('/users/me', tokenValidation,upload.single("avatar"), update)
  router.get('/users/me',tokenValidation,getUser)
  // router.get('/users/all',tokenValidation,Authorization, getAllUsers)
// router.put("/edithod/:user_name",editHOD)
// module.exports = router
export default router;