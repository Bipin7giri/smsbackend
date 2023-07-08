import {
  create,
  createMeeting,
  deleteById,
  get,
  getAllMeetingList,
  getAssignSubject,
  getByID,
  joinMeeting,
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
router.post("/createmeeting", tokenValidation, createMeeting);
router.get("/joinmeeting/:subjectId", tokenValidation, joinMeeting);
router.get("/all/meetinglist/:subjectId",tokenValidation,getAllMeetingList)
export default router;
