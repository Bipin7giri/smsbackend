// const Joi = require('joi');
import * as Joi from "joi";
export const  RegisterSchema = Joi.object({
    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    email: Joi.string().required()
})


export const  UserUpdateSchema = Joi.object({
    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    firstName:Joi.string(),
    lastName:Joi.string(),
    phoneNumber:Joi.string(),
    address:Joi.string(),
    avatar:Joi.string()
})

export const  AddTeacherSchema = Joi.object({
    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    name: Joi.string().required(),
    subjectName:Joi.string().required(),
  
    
})
  
  




