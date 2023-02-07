import { create, deleteById, get, update } from "../controllers/subject.controller";
import * as express from 'express'
import { AdminAuthorization, HODAuthorization, tokenValidation } from "../helper/jwt";
const   router = express.Router();
router.post('/hod/subject', tokenValidation,HODAuthorization, create);
router.get('/hod/subject', tokenValidation,HODAuthorization, get);
router.patch('/hod/subject/:subjectId', tokenValidation,HODAuthorization, update);
router.delete('/hod/subject/:subjectId', tokenValidation,HODAuthorization, deleteById);



// router.post('/login',login)
  // router.patch('/users/me', tokenValidation,upload.single("avatar"), update)
//   router.get('/users/me',tokenValidation,getUser)
  // router.get('/users/all',tokenValidation,Authorization, getAllUsers)
// router.put("/edithod/:user_name",editHOD)
// module.exports = router
export default router;