import { createArticleValidator, articleIdValidator, deleteArticleByIdValidator } from '@src/validators/article.validator'

describe('Function createArticleValidator', () => {
   it('Responds with an error as req body is required', () => {
      const { error } = createArticleValidator.validate({})
      expect(error).toBeDefined()
   })

   it('Responds with an error as email format is wrong', () => {
      const input = { email: 123, password: 'test1', title: 'test1', content: 'test1' }
      const { error } = createArticleValidator.validate(input)
      expect(error).toBeDefined()
   })

   it('Responds with an error as password format is wrong', () => {
      const input = { email: 'test1@test1.com', password: 123, title: 'test1', content: 'test1' }
      const { error } = createArticleValidator.validate(input)
      expect(error).toBeDefined()
   })

   it('Responds with an error as title format is wrong', () => {
      const input = { email: 'test1@test1.com', password: 'test1', title: 123, content: 'test1' }
      const { error } = createArticleValidator.validate(input)
      expect(error).toBeDefined()
   })

   it('Responds with an error as content format is wrong', () => {
      const input = { email: 'test1@test1.com', password: 'test1', title: 'test1', content: 123 }
      const { error } = createArticleValidator.validate(input)
      expect(error).toBeDefined()
   })

   it('Responds with an error as some value is required', () => {
      const input = { email: '', password: '', title: '', content: '' }
      const { error } = createArticleValidator.validate(input)
      expect(error).toBeDefined()
   })

   it('Responds with no error as correct body is supplied', () => {
      const input = { email: 'test1@test1.com', password: 'test1', title: 'test1', content: 'test1' }
      const { error } = createArticleValidator.validate(input)
      expect(error).toBeUndefined()
   })
})

describe('Function articleIdValidator', () => {
   it('Responds with an error as req body is required', () => {
      const { error } = articleIdValidator.validate({})
      expect(error).toBeDefined()
   })

   it('Responds with an error as id format is wrong', () => {
      const input = { id: true }
      const { error } = articleIdValidator.validate(input)
      expect(error).toBeDefined()
   })

   it('Responds with an error as some value is required in id', () => {
      const input = { id: '' }
      const { error } = articleIdValidator.validate(input)
      expect(error).toBeDefined()
   })

   it('Responds with no error as correct id is supplied', () => {
      const input = { id: 123 }
      const { error } = articleIdValidator.validate(input)
      expect(error).toBeUndefined()
   })
})

describe('Function deleteArticleByIdValidator', () => {
   it('Responds with an error as req body is required', () => {
      const { error } = deleteArticleByIdValidator.validate({})
      expect(error).toBeDefined()
   })

   it('Responds with an error as email format is wrong', () => {
      const input = { email: 123, password: 'test1', articleId: 123 }
      const { error } = deleteArticleByIdValidator.validate(input)
      expect(error).toBeDefined()
   })
   it('Responds with an error as password format is wrong', () => {
      const input = { email: 'test1@test1.com', password: 123, articleId: 123 }
      const { error } = deleteArticleByIdValidator.validate(input)
      expect(error).toBeDefined()
   })
   it('Responds with an error as articleId format is wrong', () => {
      const input = { email: 'test1@test1.com', password: 'test1', articleId: true }
      const { error } = deleteArticleByIdValidator.validate(input)
      expect(error).toBeDefined()
   })

   it('Responds with an error as some value is required in all properties', () => {
      const input = { email: '', password: '', articleId: '' }
      const { error } = deleteArticleByIdValidator.validate(input)
      expect(error).toBeDefined()
   })

   it('Responds with no error as correct id is supplied', () => {
      const input = { email: 'test1@test1.com', password: 'test1' }
      const { error } = deleteArticleByIdValidator.validate(input)
      expect(error).toBeUndefined()
   })
})
