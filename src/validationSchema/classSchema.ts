import * as Joi from "joi";
export const ClassSchema = Joi.object({
  subjectId: Joi.number().required(),
  studentId: Joi.array().required(),
  semesterId: Joi.number().required(),
});

export const ClassPatchSchema = Joi.object({
  studentId: Joi.array().required(),
});

export const JoinClassRoom = Joi.object({
  classCode: Joi.string().required(),
});
