import {
  create,
  createMeeting,
  createNotification,
  deleteById,
  get,
  getAllMeetingList,
  getAllMeetingListTeacher,
  getAssignSubject,
  getByID,
  getClassNotificationForStudent,
  getStudentById,
  joinMeeting,
  pushNotification,
  update,
} from "../controllers/subject.controller";
import * as express from "express";
import {
  HODAuthorization,
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
router.get("/all/meetinglist/:subjectId", tokenValidation, getAllMeetingList);
router.get(
  "/all/teacher/meetinglist/",
  tokenValidation,
  getAllMeetingListTeacher
);

// notification
router.post("/teacher/notification", tokenValidation, createNotification);
router.get(
  "/student/notification",
  tokenValidation,
  getClassNotificationForStudent
);
router.get("/student/:id", getStudentById);

export default router;
