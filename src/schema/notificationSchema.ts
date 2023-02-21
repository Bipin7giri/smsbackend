import * as Joi from "joi";
export const NotificationSchemaTeacher = Joi.object({
  title:Joi.string().required(),
  body:Joi.string().required(),
//   deviceId:Joi.string()
});