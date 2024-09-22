import { Joi } from 'express-validation'

export const createArticleValidator = Joi.object({
   email: Joi.string().required(),
   password: Joi.string().required(),
   title: Joi.string().required(),
   content: Joi.string().required(),
})

export const articleIdValidator = Joi.object({
   id: Joi.number().required(),
})

export const deleteArticleByIdValidator = Joi.object({
   email: Joi.string().required(),
   password: Joi.string().required(),
})
