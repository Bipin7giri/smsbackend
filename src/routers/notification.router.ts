import { create,get } from "../controllers/admin.controller";
import * as express from "express";
import {
  AdminAuthorization,
  tokenValidation,
} from "../helper/jwt";
const router = express.Router();
router.post(
  "/admin/notification",
  tokenValidation,
  AdminAuthorization,
  create
);

router.get(
    "/admin/notification",
    tokenValidation,
    AdminAuthorization,
    get
);


export default router;
