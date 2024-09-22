require('dotenv').config()
import knex, { type Knex } from 'knex'

let client: Knex | undefined

export const getClientConfig = () => ({
   client: 'mysql2',
   connection: {
      host: process.env.DB_HOST!,
      port: process.env.DB_PORT!,
      user: process.env.DB_USER!,
      password: process.env.DB_PASSWORD!,
      database: process.env.DB_NAME!,
   },
   migrations: {
      directory: './migrations',
   },
   debug: true,
})

export const connectToDatabase = () => {
   if (!client) {
      client = knex(getClientConfig())
   }
}

export const disconnectFromDatabase = async () => {
   if (client) {
      await client.destroy()
      client = undefined
   }
}

export const getClient = () => {
   if (!client) {
      throw new Error('Client is not defined')
   }

   return client
}
