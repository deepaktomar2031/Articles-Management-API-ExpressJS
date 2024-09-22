import { Express, Request, Response } from 'express'
import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import { version } from '../../package.json'
import path from 'path'
import yaml from 'yamljs'

const swaggerYML = yaml.load(path.resolve(__dirname, './swagger.yml'))

const initialOptions = {
   definition: {
      openapi: '3.0.0',
      info: {
         title: 'Article Management API',
         version: version,
         description: 'API Docs - Article Management',
      },
   },
}
const options: swaggerJsdoc.Options = {
   swaggerDefinition: {
      ...initialOptions,
      ...swaggerYML,
   },
   apis: [path.resolve(__dirname, './../../src/routes/routes.ts')],
}

const SwaggerSpec = swaggerJsdoc(options)

export const SwaggerDocs = (app: Express, PORT: number) => {
   app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(SwaggerSpec))

   app.get('/api-docs.json', (req: Request, res: Response) => {
      res.setHeader('Content-Type', 'application/json')
      res.send(SwaggerSpec)
   })

   console.log(`API Docs are available at http://localhost:${PORT}/api-docs`)
}
