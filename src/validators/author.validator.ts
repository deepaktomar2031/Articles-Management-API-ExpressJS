import { Joi } from 'express-validation'

export const createAuthorValidator = Joi.object({
   name: Joi.string().required(),
   email: Joi.string().required(),
   password: Joi.string().required(),
})

export const authorIdValidator = Joi.object({
   id: Joi.number().required(),
})
