import { Request, Response } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { HTTP_STATUS, message, LogErrorMessage } from './../utils'

/**
 * Authentication Middleware
 * @param req
 * @param res
 * @param next
 */
export const authenticationMiddleware = async (req: Request, res: Response, next: Function) => {
   try {
      // authorization header check
      const authorizationHeader = req.headers.authorization
      if (!authorizationHeader) return res.status(HTTP_STATUS.UNAUTHORIZED).send({ message: message.Authorzation_Header_Missing })

      // token check
      const token: string = authorizationHeader.split(' ')[1]
      if (!token) return res.status(HTTP_STATUS.UNAUTHORIZED).send({ message: message.Token_Missing })

      try {
         // payload check
         const payload = jwt.verify(token, process.env.SECRET_KEY!) as JwtPayload

         // token expiry check
         const now = Math.floor(Date.now() / 1000)
         if (payload.exp && payload.exp < now)
            return res.status(HTTP_STATUS.UNAUTHORIZED).send({ message: message.Token_Expired })

         next()
      } catch (error) {
         return res.status(HTTP_STATUS.UNAUTHORIZED).send({ message: message.Invalid_Token })
      }
   } catch (error: unknown) {
      console.log(LogErrorMessage(error))
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({ successful: false, message: message.Something_went_wrong })
   }
}
