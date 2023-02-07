import * as Joi from "joi";
export const  SubjectAndClassShcema = Joi.object({
    subjectName: Joi.string().required(),
    teacherId:Joi.number().required(),
    semesterId:Joi.number().required(),
    studentId:Joi.array().required(),
})

export const  SubjectPathSchema = Joi.object({
    subject_name: Joi.string(),
    teacherId:Joi.number(),
    semesterId:Joi.number()
})