import * as Joi from "joi";
export const  SemesterSchema = Joi.object({
    name: Joi.string().required(),
    // studentId:Joi.array().required(),
    departmentId:Joi.number().required()
})