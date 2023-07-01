import * as Joi from "joi";
export const FinancialSchema = Joi.object({
  studentId: Joi.string().required(),
  clearAmount: Joi.string().required(),
  transcationId: Joi.string().required(),
  paymentStatus: Joi.string().required(),
});
export const AddFinancialDetails = Joi.object({
  studentId: Joi.string().required(),
  paidAmount: Joi.number().required(),
  paymentStatus: Joi.string().valid("paid", "pending", "canceled").required(),
  transcationId: Joi.string().required(),
});
