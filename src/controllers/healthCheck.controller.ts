import { Request, Response } from 'express'
import { HTTP_STATUS, message, LogErrorMessage } from '@src/utils'

export const healthCheck = async (req: Request, res: Response) => {
   try {
      res.status(HTTP_STATUS.OK).json({
         successful: true,
         message: message.Server_Is_Up_And_Running,
      })
   } catch (error: unknown) {
      console.log(LogErrorMessage(error))
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({ successful: false, message: message.Something_went_wrong })
   }
}
