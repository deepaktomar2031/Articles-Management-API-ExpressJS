import { Joi } from 'express-validation'

export const createCommentValidator = Joi.object({
   content: Joi.string().required(),
   articleId: Joi.number().required(),
   authorId: Joi.number().required(),
})

export const commentIdValidator = Joi.object({
   id: Joi.number().required(),
})
