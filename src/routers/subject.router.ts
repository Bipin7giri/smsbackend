import {
  create,
  createMeeting,
  deleteById,
  get,
  getAssignSubject,
  getByID,
  pushNotification,
  update,
} from "../controllers/subject.controller";
import * as express from "express";
import {
  AdminAuthorization,
  HODAuthorization,
  StudentAuthorization,
  TeacherAuthorization,
  tokenValidation,
} from "../helper/jwt";
const router = express.Router();
router.post("/hod/subject", tokenValidation, HODAuthorization, create);
router.get("/hod/subject", tokenValidation, HODAuthorization, get);
router.get(
  "/hod/subject/:subjectId",
  tokenValidation,
  HODAuthorization,
  getByID
);
router.get("/student/subject/:subjectId", tokenValidation, getByID);
router.get("/student/subject", tokenValidation, getAssignSubject);
router.patch(
  "/hod/subject/:subjectId",
  tokenValidation,
  HODAuthorization,
  update
);
router.delete(
  "/hod/subject/:subjectId",
  tokenValidation,
  HODAuthorization,
  deleteById
);
router.get("/teacher/subject", tokenValidation, TeacherAuthorization, get);
router.post("/class/notification", pushNotification);

// create meeting
router.get("/createmeeting", createMeeting);
export default router;
