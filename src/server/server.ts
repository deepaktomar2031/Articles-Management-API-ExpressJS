require('dotenv').config()
import express, { Express } from 'express'
import { connectToDatabase } from '@src/config/databaseConfig'
import { routes } from '@src/routes/routes'
import { LogErrorMessage } from '@src/utils'
import { SwaggerDocs } from '@docs/swagger/swagger'

export const app: Express = express()
export const PORT = process.env.PORT! || 4000

const listenPort = (PORT: number) => {
   app.listen(PORT, () => console.log(`Server is up & running on http://localhost:${PORT}`))
}

const userBodyParser = () => {
   app.use(express.json())
}

const createRoutes = async () => {
   routes(app)
}

const createSwaggerDocs = () => {
   SwaggerDocs(app, Number(PORT))
}

const start = async () => {
   try {
      if (process.env.NODE_ENV !== 'test') {
         await listenPort(Number(PORT))
         createSwaggerDocs()
      }
      userBodyParser()
      await connectToDatabase()
      await createRoutes()
   } catch (error) {
      console.log(LogErrorMessage(error))
   }
}

export default {
   start,
}
