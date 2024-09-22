import { createClient } from 'redis'

export type RedisClientType = ReturnType<typeof createClient>

const REDIS_URL: string = `redis://${process.env.REDIS_HOST!}:${process.env.REDIS_PORT!}`

const redisClient: RedisClientType = createClient({ url: REDIS_URL })

redisClient.on('error', function (err) {
   throw err
})

redisClient.connect()

export default redisClient
