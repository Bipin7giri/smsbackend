"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResetPassword = exports.ForgetPassword = exports.AddTeacherSchema = exports.UserUpdateSchema = exports.StudentRegisterSchema = exports.RegisterSchema = void 0;
// const Joi = require('joi');
var Joi = require("joi");
exports.RegisterSchema = Joi.object({
    password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
    email: Joi.string().required(),
    deviceId: Joi.string()
});
exports.StudentRegisterSchema = Joi.object({
    password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
    departmentId: Joi.string().required(),
    full_name: Joi.string().required(),
});
exports.UserUpdateSchema = Joi.object({
    password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
    firstName: Joi.string(),
    lastName: Joi.string(),
    phoneNumber: Joi.string(),
    address: Joi.string(),
    avatar: Joi.string(),
});
exports.AddTeacherSchema = Joi.object({
    password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
    name: Joi.string().required(),
    subjectName: Joi.string().required(),
});
exports.ForgetPassword = Joi.object({
    email: Joi.string().email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net"] },
    }),
});
exports.ResetPassword = Joi.object({
    otp: Joi.string().required(),
    password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
});
//# sourceMappingURL=registerSchema.js.map