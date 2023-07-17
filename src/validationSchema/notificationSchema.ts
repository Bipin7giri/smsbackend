import * as Joi from "joi";
export const NotificationSchemaTeacher = Joi.object({
  title:Joi.string().required(),
  body:Joi.string().required(),
//   deviceId:Joi.string()
});


export const NotificationSchemaAdmin = Joi.object({
  title:Joi.string().required(),
  body:Joi.string().required(),
  // data:Joi.object()
//   deviceId:Joi.string()
});