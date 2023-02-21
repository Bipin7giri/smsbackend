const router = require("express").Router();
import auth from "../routers/auth.router";
import role from "../routers/role.router";
import department from "../routers/department.router";
import semester from "../routers/semester.router";
import classes from "../routers/class.router";
import subjects from "../routers/subject.router";
import assignment from "../routers/assignment.router";
import chat from "../routers/chat.router";


router.use("/auth", auth);
router.use("/", role);
router.use("/", department);
router.use("/", semester);
router.use("/", classes);
router.use("/", subjects);
router.use("/", assignment);
router.use("/", chat);


export default router;
