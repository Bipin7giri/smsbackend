import { FinancialController } from "../controllers/financial.controller";
import * as express from "express";
import { addBulkStudent } from "../controllers/semester.controller";
import { AddFinancialDetails } from "../schema/financialSchema";
import {
  AccountAuthorization,
  StudentAuthorization,
  tokenValidation,
} from "../helper/jwt";

const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.get(
  "/get",
  tokenValidation,
  AccountAuthorization,
  FinancialController.prototype.get.bind(FinancialController)
);

router.post(
  "/add",
  tokenValidation,
  AccountAuthorization,
  FinancialController.prototype.post.bind(FinancialController)
);

router.delete(
  "/remove/:id",
  tokenValidation,
  AccountAuthorization,
  FinancialController.prototype.delete.bind(FinancialController)
);

router.get(
  "/statment",
  tokenValidation,
  StudentAuthorization,
  FinancialController.prototype.getMe.bind(FinancialController)
);
// router.get(
//   "/add_financial_details",
//   FinancialController.prototype.addBulkFincnailDetails.bind(FinancialController)
// );
export default router;
