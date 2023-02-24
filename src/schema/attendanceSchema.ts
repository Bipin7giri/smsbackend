import * as Joi from "joi";
export const AttendanceSchema = Joi.object({
  isPresent : Joi.boolean().required(),
  studentId:Joi.number().required()
});