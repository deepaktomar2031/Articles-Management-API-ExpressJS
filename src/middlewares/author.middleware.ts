import { Request, Response } from 'express'
import { createAuthorValidator, authorIdValidator } from '@src/validators'
import { HTTP_STATUS } from '@src/utils'

export const createAuthorValidatorMiddleware = (req: Request, res: Response, next: Function) => {
   const { error } = createAuthorValidator.validate(req.body)

   if (error) return res.status(HTTP_STATUS.BAD_REQUEST).send({ successful: true, error_message: error.message })

   next()
}

export const authorIdValidatorMiddleware = (req: Request, res: Response, next: Function) => {
   const { error } = authorIdValidator.validate(req.params)

   if (error) return res.status(HTTP_STATUS.BAD_REQUEST).send({ successful: true, error_message: error.message })

   next()
}
