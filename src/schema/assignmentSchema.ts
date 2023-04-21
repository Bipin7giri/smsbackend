import * as Joi from "joi";
export const CreateAssignment = Joi.object({
  pdf: Joi.string(),
  word: Joi.string(),
  deadLine: Joi.date().required(),
});

export const SubmitAssignment = Joi.object({
  assignmentId: Joi.string(),
  submission: Joi.string(),
});

export const RateSubmitedAssignment = Joi.object({
  submitedAssignmentId: Joi.number().required(),
  rating: Joi.number().max(5).min(0).required(),
});

export const AssignmentReports = Joi.object({
  studentId: Joi.number().required(),
  subjectId: Joi.number().required(),
});
