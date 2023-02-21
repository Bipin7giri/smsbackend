import * as Joi from "joi";
export const CreateAssignment = Joi.object({
  pdf: Joi.string(),
  word: Joi.string(),
  deadLine: Joi.date().required(),
});

export const SubmitAssigment = Joi.object({
    assigmnmentId: Joi.string().required(),
    submission: Joi.string(),
  });
  
