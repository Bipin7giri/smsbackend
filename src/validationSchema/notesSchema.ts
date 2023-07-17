import * as Joi from "joi";
export const CreateNotes = Joi.object({
    pdf: Joi.string(),
    word: Joi.string(),
});



