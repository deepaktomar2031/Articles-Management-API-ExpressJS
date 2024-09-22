import { createArticle, getArticleById, getAllArticles } from '@src/controllers'
import { authorAdapter, articleAdapter } from '@src/adapters'
import { HTTP_STATUS, message } from '@src/utils'
import { Request, Response } from 'express'
import * as bcrypt from 'bcrypt'
import redisClient from '@src/config/redisConfig'

const id = 1
const name = 'test'
const email = 'test@test.com'
const password = 'test'
const isAdmin = false

const articleId = 1
const title = 'test'
const content = 'test'
const authorId = 1
const createdAt = new Date()

jest.mock('bcrypt', () => ({
   compare: jest.fn(),
}))

const mockResponse = () => {
   const res: Partial<Response> = {}
   res.status = jest.fn().mockReturnValue(res)
   res.json = jest.fn().mockReturnValue(res)
   return res as Response
}

jest.mock('@src/config/redisConfig', () => ({
   get: jest.fn(),
   set: jest.fn(),
   on: jest.fn(),
   connect: jest.fn(),
}))

describe('createArticle Function', () => {
   let req: Partial<Request>
   let res: Partial<Response>
   let statusMock: jest.Mock
   let jsonMock: jest.Mock

   beforeEach(async () => {
      req = { body: { email, password, title, content } }
      res = { status: statusMock, json: jsonMock }

      statusMock = jest.fn().mockReturnThis()
      jsonMock = jest.fn().mockReturnThis()
   })

   afterEach(async () => {
      jest.restoreAllMocks()
   })

   it('should respond with 200 OK and insert the article if author exists & email/pass is correct', async () => {
      const res = mockResponse()
      const author = { id, name, email, password, isAdmin }
      const article = { id, authorId, title, content, createdAt }

      const findEntrySpy = jest.spyOn(authorAdapter, 'findEntry').mockResolvedValue(author)
      const insertEntrySpy = jest.spyOn(articleAdapter, 'insertEntry').mockResolvedValue(article)

      ;(bcrypt.compare as jest.Mock).mockResolvedValue(true)

      await createArticle(req as Request, res as Response)

      expect(authorAdapter.findEntry).toHaveBeenCalledWith({ email })
      expect(articleAdapter.insertEntry).toHaveBeenCalledWith(
         expect.objectContaining({ authorId: 1, title: 'test', content: 'test' }),
      )

      expect(findEntrySpy).toHaveBeenCalledTimes(1)
      expect(insertEntrySpy).toHaveBeenCalledTimes(1)
      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK)
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ successful: true, message: message.Inserted_Successfully }))
   })

   it('should respond with 404 NOT FOUND if author not found and should not insert the article', async () => {
      const res = mockResponse()
      const article = { id, authorId, title, content, createdAt }

      const findEntrySpy = jest.spyOn(authorAdapter, 'findEntry').mockResolvedValue(undefined)
      const insertEntrySpy = jest.spyOn(articleAdapter, 'insertEntry').mockResolvedValue(article)

      await createArticle(req as Request, res as Response)

      expect(authorAdapter.findEntry).toHaveBeenCalledWith({ email })
      expect(articleAdapter.insertEntry).not.toHaveBeenCalled()

      expect(findEntrySpy).toHaveBeenCalledTimes(1)
      expect(insertEntrySpy).toHaveBeenCalledTimes(0)
      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.NOT_FOUND)
      expect(res.json).toHaveBeenCalledWith({ successful: true, message: message.Author_not_found })
   })

   it('should responds respond with 401 UNAUTHORIZED if credentials are incorrect', async () => {
      const res = mockResponse()
      const author = { id, name, email, password, isAdmin }
      const article = { id, authorId, title, content, createdAt }

      const findEntrySpy = jest.spyOn(authorAdapter, 'findEntry').mockResolvedValue(author)
      const insertEntrySpy = jest.spyOn(articleAdapter, 'insertEntry').mockResolvedValue(article)

      ;(bcrypt.compare as jest.Mock).mockResolvedValue(false)

      await createArticle(req as Request, res as Response)

      expect(authorAdapter.findEntry).toHaveBeenCalledWith({ email })
      expect(articleAdapter.insertEntry).not.toHaveBeenCalled()

      expect(findEntrySpy).toHaveBeenCalledTimes(1)
      expect(insertEntrySpy).toHaveBeenCalledTimes(0)
      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.UNAUTHORIZED)
      expect(res.json).toHaveBeenCalledWith({ successful: true, message: message.Incorret_Credentials })
   })
})

describe('getArticleById Function', () => {
   let req: Partial<Request>
   let res: Partial<Response>
   let statusMock: jest.Mock
   let jsonMock: jest.Mock

   beforeEach(async () => {
      req = { params: { id: String(id) } }
      res = { status: statusMock, json: jsonMock }

      statusMock = jest.fn().mockReturnThis()
      jsonMock = jest.fn().mockReturnThis()
   })

   afterEach(async () => {
      jest.restoreAllMocks()
   })

   it('should respond with 200 OK if requested article is inside cache (redis)', async () => {
      const res = mockResponse()
      const article = { id, authorId, title, content, createdAt }
      const getSpy = jest.spyOn(redisClient, 'get').mockResolvedValue(JSON.stringify(article))
      const findEntrySpy = jest.spyOn(articleAdapter, 'findEntry').mockResolvedValue(article)

      req.params = { id: '1' }

      await getArticleById(req as Request, res as Response)

      expect(getSpy).toHaveBeenCalledTimes(1)
      expect(getSpy).toHaveBeenCalledWith('1')

      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK)
      expect(res.json).toHaveBeenCalledWith(
         expect.objectContaining({
            successful: true,
            message: message.Fetched_From_Cache,
            result: expect.objectContaining({ id, authorId, title, content }),
         }),
      )
      expect(findEntrySpy).toHaveBeenCalledTimes(0)
   })

   it('should respond with 404 NOT FOUND if requested article does not exist neither in redis nor in database', async () => {
      const res = mockResponse()

      const getSpy = jest.spyOn(redisClient, 'get').mockResolvedValue(undefined)
      const findEntrySpy = jest.spyOn(articleAdapter, 'findEntry').mockResolvedValue(undefined)

      req.params = { id: '1' }

      await getArticleById(req as Request, res as Response)

      expect(getSpy).toHaveBeenCalledTimes(1)
      expect(getSpy).toHaveBeenCalledWith('1')

      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.NOT_FOUND)
      expect(res.json).toHaveBeenCalledWith({ successful: true, message: message.Article_not_found })
      expect(findEntrySpy).toHaveBeenCalledTimes(1)
   })

   it('should responds with 200 OK if requested article is not found in redis but found in database', async () => {
      const res = mockResponse()

      const article = { id, authorId, title, content, createdAt }

      const getSpy = jest.spyOn(redisClient, 'get').mockResolvedValue(undefined)
      const findEntrySpy = jest.spyOn(articleAdapter, 'findEntry').mockResolvedValue(article)

      req.params = { id: '1' }

      await getArticleById(req as Request, res as Response)

      expect(getSpy).toHaveBeenCalledTimes(1)
      expect(getSpy).toHaveBeenCalledWith('1')

      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK)
      expect(res.json).toHaveBeenCalledWith(
         expect.objectContaining({
            successful: true,
            message: message.Fetched_Successfully,
            result: expect.objectContaining({ id, authorId, title, content }),
         }),
      )
      expect(findEntrySpy).toHaveBeenCalledTimes(1)
   })
})

describe('getAllArticles Function', () => {
   let req: Partial<Request>
   let res: Partial<Response>
   let statusMock: jest.Mock
   let jsonMock: jest.Mock

   beforeEach(async () => {
      req = { params: { id: String(id) } }
      res = { status: statusMock, json: jsonMock }

      statusMock = jest.fn().mockReturnThis()
      jsonMock = jest.fn().mockReturnThis()
   })

   afterEach(async () => {
      jest.restoreAllMocks()
   })

   it('should respond with 200 OK with a list of all articles available in database', async () => {
      const res = mockResponse()
      const article = { id, authorId, title, content, createdAt }
      const findEntriesSpy = jest.spyOn(articleAdapter, 'findEntries').mockResolvedValue([article])

      await getAllArticles(req as Request, res as Response)

      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK)
      expect(res.json).toHaveBeenCalledWith(
         expect.objectContaining({
            successful: true,
            message: message.Fetched_Successfully,
            result: [expect.objectContaining({ id, authorId, title, content })],
         }),
      )
      expect(findEntriesSpy).toHaveBeenCalledTimes(1)
   })
})
