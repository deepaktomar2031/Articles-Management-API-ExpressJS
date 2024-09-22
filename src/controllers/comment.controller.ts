import { Request, Response } from 'express'
import { authorAdapter, articleAdapter, commentAdapter } from '@src/adapters'
import { HTTP_STATUS, message, LogErrorMessage } from '@src/utils'

// Create new comment
export const createComment = async (req: Request, res: Response) => {
   try {
      const { authorId, articleId, content } = req.body

      // Check if the author exists
      const author = await authorAdapter.findEntry({ id: authorId })
      if (!author) {
         return res.status(HTTP_STATUS.NOT_FOUND).json({ successful: true, message: message.Author_not_found })
      }

      // Check if the article exists
      const article = await articleAdapter.findEntry({ id: articleId })
      if (!article) {
         return res.status(HTTP_STATUS.NOT_FOUND).json({ successful: true, message: message.Article_not_found })
      }

      const commentData = { authorId, articleId, content, createdAt: new Date() }
      await commentAdapter.insertEntry(commentData)

      res.status(HTTP_STATUS.OK).json({ successful: true, message: message.Inserted_Successfully })
   } catch (error: unknown) {
      console.log(LogErrorMessage(error))
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({ successful: false, message: message.Something_went_wrong })
   }
}

// Read comment by id
export const readCommentById = async (req: Request, res: Response) => {
   try {
      const { id } = req.params
      const result = await commentAdapter.findEntry({ id })

      if (!result) {
         return res.status(HTTP_STATUS.NOT_FOUND).json({ successful: true, message: message.Comment_not_found })
      }

      res.status(HTTP_STATUS.OK).json({ successful: true, message: message.Fetched_Successfully, result })
   } catch (error: unknown) {
      console.log(LogErrorMessage(error))
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({ successful: false, message: message.Something_went_wrong })
   }
}

// Read all comments
export const readAllComments = async (req: Request, res: Response) => {
   try {
      const result = await commentAdapter.findEntries()

      if (!result) {
         return res.status(HTTP_STATUS.NOT_FOUND).json({ successful: true, message: message.No_Comments_Found })
      }

      res.status(HTTP_STATUS.OK).json({ successful: true, message: message.Fetched_Successfully, result })
   } catch (error: unknown) {
      console.log(LogErrorMessage(error))
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({ successful: false, message: message.Something_went_wrong })
   }
}
