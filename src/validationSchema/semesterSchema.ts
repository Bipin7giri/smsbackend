import * as Joi from "joi";
export const  SemesterSchema = Joi.object({
    name: Joi.string().required(),
    // studentId:Joi.array().required(),
})

export const  SemesterPatchSchema = Joi.object({
    name: Joi.string().required(),
    // studentId:Joi.array().required(),
})