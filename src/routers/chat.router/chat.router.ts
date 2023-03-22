import {
  create,
  findChat,
  userChats,
} from "../../controllers/chat/chat.controller";
import * as express from "express";
import {
  AdminAuthorization,
  HODAuthorization,
  StudentAuthorization,
  TeacherAuthorization,
  tokenValidation,
} from "../../helper/jwt";
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
router.post(
  "/",
  // tokenValidation,
  //   upload.single("assignment"),
  create
);

router.get("/:userId", userChats);
router.get("/find/:firstId/:secondId", findChat);

export default router;
