import { Request, Response } from 'express'
import { authorAdapter, articleAdapter, commentAdapter } from '@src/adapters'
import { HTTP_STATUS, message, LogErrorMessage } from '@src/utils'
import redisClient from '@src/config/redisConfig'
import * as bcrypt from 'bcrypt'

// Create new article
export const createArticle = async (req: Request, res: Response) => {
   try {
      const { email, password, title, content } = req.body

      // Check if the author exists
      const author = await authorAdapter.findEntry({ email })
      if (!author) {
         return res.status(HTTP_STATUS.NOT_FOUND).json({ successful: true, message: message.Author_not_found })
      }

      const isPasswordMatch = await bcrypt.compare(password, author.password)

      // Check if the author's email & password matches
      if (author.email !== email || !isPasswordMatch) {
         return res.status(HTTP_STATUS.UNAUTHORIZED).json({ successful: true, message: message.Incorret_Credentials })
      }

      // Insert new article into the database
      const authorId = author.id
      const article = { authorId, title, content, createdAt: new Date() }
      const result = await articleAdapter.insertEntry(article)

      res.status(HTTP_STATUS.OK).json({ successful: true, message: message.Inserted_Successfully, articleId: result })
   } catch (error: unknown) {
      console.log(LogErrorMessage(error))
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({ successful: false, message: message.Something_went_wrong })
   }
}

// Get article by id
export const getArticleById = async (req: Request, res: Response) => {
   try {
      const { id } = req.params

      const value = await redisClient.get(id)

      if (value) {
         return res
            .status(HTTP_STATUS.OK)
            .json({ successful: true, message: message.Fetched_From_Cache, result: JSON.parse(value) })
      }

      const result = await articleAdapter.findEntry({ id })

      if (!result) {
         return res.status(HTTP_STATUS.NOT_FOUND).json({ successful: true, message: message.Article_not_found })
      }

      await redisClient.set(id, JSON.stringify(result))

      res.status(HTTP_STATUS.OK).json({ successful: true, message: message.Fetched_Successfully, result })
   } catch (error: unknown) {
      console.log(LogErrorMessage(error))
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({ successful: false, message: message.Something_went_wrong })
   }
}

// Get all articles
export const getAllArticles = async (req: Request, res: Response) => {
   try {
      const result = await articleAdapter.findEntries()

      if (!result) {
         return res.status(HTTP_STATUS.NOT_FOUND).json({ successful: true, message: message.No_Articles_Found })
      }

      res.status(HTTP_STATUS.OK).json({ successful: true, message: message.Fetched_Successfully, result })
   } catch (error: unknown) {
      console.log(LogErrorMessage(error))
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({ successful: false, message: message.Something_went_wrong })
   }
}

// Delete article by id (ONLY FOR ADMIN)
export const deleteArticleById = async (req: Request, res: Response) => {
   try {
      const { email, password } = req.body

      // Check if the author exists
      const author = await authorAdapter.findEntry({ email })
      if (!author) {
         return res.status(HTTP_STATUS.NOT_FOUND).json({ successful: true, message: message.Author_not_found })
      }

      const isPasswordMatch = await bcrypt.compare(password, author.password)

      // Check if the author's email & password matches
      if (author.email !== email || !isPasswordMatch) {
         return res.status(HTTP_STATUS.UNAUTHORIZED).json({ successful: true, message: message.Incorret_Credentials })
      }

      const { id } = req.params

      const article = await articleAdapter.findEntry({ id })

      if (!article) {
         return res.status(HTTP_STATUS.NOT_FOUND).json({ successful: true, message: message.Article_not_found })
      }

      // Delete article and its comments
      const result = articleAdapter.withTransaction(async (trx) => {
         await commentAdapter.deleteEntries({ articleId: id }, trx)
         await articleAdapter.deleteEntries({ id }, trx)
      })

      res.status(HTTP_STATUS.OK).json({ successful: true, message: message.Article_Deleted_Successfully, result })
   } catch (error: unknown) {
      console.log(LogErrorMessage(error))
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({ successful: false, message: message.Something_went_wrong })
   }
}
