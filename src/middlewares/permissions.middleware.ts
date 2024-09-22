import { Request, Response } from 'express'
import { HTTP_STATUS, message, LogErrorMessage, Role } from './../utils'
import { authorAdapter } from '@src/adapters'
/**
 *
 * @param accessLevel
 * @returns
 */
export const permissionsMiddleware = async (req: Request, res: Response, next: Function) => {
   try {
      const { email } = req.body

      // Check if requesting user exists
      const author = await authorAdapter.findEntry({ email })

      if (!author) {
         return res.status(HTTP_STATUS.NOT_FOUND).send({ successful: true, message: message.Author_not_found })
      }

      // Check if requesting user has required access level
      if (author.isAdmin) {
         next()
      } else {
         return res.status(HTTP_STATUS.FORBIDDEN).send({ successful: true, message: message.User_Forbidden })
      }
   } catch (error: unknown) {
      console.log(LogErrorMessage(error))
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({ successful: false, message: message.Something_went_wrong })
   }
}
