import * as Joi from "joi";
export const  RoleSchema = Joi.object({
    name: Joi.string().required(),
    roles:Joi.array().required(),
})

export const  UpdateUserRole = Joi.object({
    userId: Joi.number().required(),
    roleId:Joi.number().required(),
})