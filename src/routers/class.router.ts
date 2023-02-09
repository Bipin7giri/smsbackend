import { addStudent, create, get } from "../controllers/class.controller";
import * as express from 'express'
import { AdminAuthorization, HODAuthorization, TeacherAuthorization, tokenValidation } from "../helper/jwt";
const   router = express.Router();
router.post('/hod/class', tokenValidation,HODAuthorization, create);
router.get('/teacher/class', tokenValidation,TeacherAuthorization, get);
router.post('/teacher/class', tokenValidation,TeacherAuthorization, addStudent);

export default router;