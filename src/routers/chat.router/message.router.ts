import * as express from "express";
import {
  AdminAuthorization,
  HODAuthorization,
  StudentAuthorization,
  TeacherAuthorization,
  tokenValidation,
} from "../../helper/jwt";
import {
  addMessage,
  getMessage,
} from "../../controllers/chat/message.controller";
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
router.post(
  "/",
  // tokenValidation,
  //   upload.single("assignment"),
  addMessage
);

router.get("/:chatId", getMessage);

export default router;
