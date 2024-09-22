import { Request, Response } from 'express'
import { createArticleValidator, articleIdValidator, deleteArticleByIdValidator } from '@src/validators'
import { HTTP_STATUS } from '@src/utils'

export const createArticleValidatorMiddleware = (req: Request, res: Response, next: Function) => {
   const { error } = createArticleValidator.validate(req.body)

   if (error) return res.status(HTTP_STATUS.BAD_REQUEST).send({ successful: true, error_message: error.message })

   next()
}

export const articleIdValidatorMiddleware = (req: Request, res: Response, next: Function) => {
   const { error } = articleIdValidator.validate(req.params)

   if (error) return res.status(HTTP_STATUS.BAD_REQUEST).send({ successful: true, error_message: error.message })

   next()
}

export const deleteArticleValidatorMiddleware = (req: Request, res: Response, next: Function) => {
   const { error } = deleteArticleByIdValidator.validate(req.body) && articleIdValidator.validate(req.params)

   if (error) return res.status(HTTP_STATUS.BAD_REQUEST).send({ successful: true, error_message: error.message })

   next()
}
