import * as Joi from "joi";
export const  SubjectAndClassShcema = Joi.object({
    subjectName: Joi.string().required(),
    teacherId:Joi.number().required(),
    semesterId:Joi.number().required(),
    studentId:Joi.array().required(),
})