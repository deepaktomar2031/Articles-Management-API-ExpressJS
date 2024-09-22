import { Request, Response } from 'express'
import { createCommentValidator, commentIdValidator } from '@src/validators'
import { HTTP_STATUS } from '@src/utils'

export const createCommentValidatorMiddleware = (req: Request, res: Response, next: Function) => {
   const { error } = createCommentValidator.validate(req.body)

   if (error) return res.status(HTTP_STATUS.BAD_REQUEST).send({ successful: true, error_message: error.message })

   next()
}

export const getCommentByIdValidatorMiddleware = (req: Request, res: Response, next: Function) => {
   const { error } = commentIdValidator.validate(req.params)

   if (error) return res.status(HTTP_STATUS.BAD_REQUEST).send({ successful: true, error_message: error.message })

   next()
}
