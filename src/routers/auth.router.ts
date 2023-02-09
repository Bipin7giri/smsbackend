import {register, login, getUser, updateUser} from "../controllers/auth.controller";
import * as express from 'express'
import { tokenValidation } from "../helper/jwt";
const   router = express.Router();
const multer = require("multer");
const upload = multer({ dest: 'uploads/' });
  router.post('/register',register);
  router.post('/login',login)
  router.get('/users/me',tokenValidation,getUser)
router.patch('/users/me', tokenValidation,upload.single("avatar"), updateUser)
export default router;