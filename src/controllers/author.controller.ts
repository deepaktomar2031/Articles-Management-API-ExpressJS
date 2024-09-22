import { Request, Response } from 'express'
import { authorAdapter } from '@src/adapters'
import { HTTP_STATUS, message, LogErrorMessage } from '@src/utils'
import { SALT_VALUE } from '@src/constants/constants'
import jwt from 'jsonwebtoken'
import * as bcrypt from 'bcrypt'

// Create new author
export const createAuthor = async (req: Request, res: Response) => {
   try {
      const { name, email, password, isAdmin = false } = req.body

      const existanceCheck = await authorAdapter.findEntry({ email })

      if (existanceCheck) {
         return res.status(HTTP_STATUS.NOT_FOUND).json({ successful: true, message: message.Email_already_exists })
      }

      // Create JWT token
      const payload = { name, email, password, isAdmin }

      const accessToken = jwt.sign(payload, process.env.SECRET_KEY!, {
         expiresIn: process.env.EXPIRATION_TIME! || '25m',
      })

      // Hash password & save to database
      const hashedPassword = await bcrypt.hash(password, SALT_VALUE)
      const authorData = { name, email, password: hashedPassword, isAdmin }
      await authorAdapter.insertEntry(authorData)

      res.status(HTTP_STATUS.OK).json({ successful: true, message: message.Inserted_Successfully, accessToken })
   } catch (error: unknown) {
      console.log(LogErrorMessage(error))
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({ successful: false, message: message.Something_went_wrong })
   }
}

// Get author by id
export const getAuthorById = async (req: Request, res: Response) => {
   try {
      const { id } = req.params
      const result = await authorAdapter.findEntry({ id })

      if (!result) {
         return res.status(HTTP_STATUS.NOT_FOUND).json({ successful: true, message: message.Author_not_found })
      }

      const { password, ...response } = result

      res.status(HTTP_STATUS.OK).json({
         successful: true,
         message: message.Fetched_Successfully,
         response,
      })
   } catch (error: unknown) {
      console.log(LogErrorMessage(error))
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({ successful: false, message: message.Something_went_wrong })
   }
}

// Get all authors
export const getAllAuthors = async (req: Request, res: Response) => {
   try {
      const result = await authorAdapter.findEntries()

      if (!result) {
         return res.status(HTTP_STATUS.NOT_FOUND).json({ successful: true, message: message.No_Authors_Found })
      }

      const response = result.map((author) => {
         const { password, ...rest } = author
         return rest
      })

      res.status(HTTP_STATUS.OK).json({ successful: true, message: message.Fetched_Successfully, response })
   } catch (error: unknown) {
      console.log(LogErrorMessage(error))
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({ successful: false, message: message.Something_went_wrong })
   }
}
