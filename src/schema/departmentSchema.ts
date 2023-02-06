import * as Joi from "joi";
export const  DepartmentSchema = Joi.object({
    name: Joi.string().required(),
    teachers:Joi.array().required(),
    hod:Joi.number().required()
})