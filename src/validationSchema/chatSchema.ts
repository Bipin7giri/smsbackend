import * as Joi from "joi";
export const ChatSchema = Joi.object({
  reciver:Joi.string().required(),
  text:Joi.string().required(),
  body:Joi.object(),
//   deviceId:Joi.string()
});