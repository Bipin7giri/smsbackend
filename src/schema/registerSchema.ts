// const Joi = require('joi');
import * as Joi from "joi";
export const RegisterSchema = Joi.object({
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
  email: Joi.string().required(),
});

export const StudentRegisterSchema = Joi.object({
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
  departmentId: Joi.string().required(),
  full_name: Joi.string().required(),
});

export const UserUpdateSchema = Joi.object({
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
  firstName: Joi.string(),
  lastName: Joi.string(),
  phoneNumber: Joi.string(),
  address: Joi.string(),
  avatar: Joi.string(),
});

export const AddTeacherSchema = Joi.object({
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
  name: Joi.string().required(),
  subjectName: Joi.string().required(),
});

export const ForgetPassword = Joi.object({
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),
});

export const ResetPassword = Joi.object({
  otp: Joi.string().required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
});
