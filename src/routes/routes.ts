import { Router } from 'express'
import {
   authenticationMiddleware,
   permissionsMiddleware,
   createAuthorValidatorMiddleware,
   authorIdValidatorMiddleware,
   createArticleValidatorMiddleware,
   articleIdValidatorMiddleware,
   deleteArticleValidatorMiddleware,
   createCommentValidatorMiddleware,
   getCommentByIdValidatorMiddleware,
} from '@src/middlewares'
import {
   healthCheck,
   createAuthor,
   getAuthorById,
   getAllAuthors,
   createArticle,
   getArticleById,
   getAllArticles,
   deleteArticleById,
   createComment,
   readCommentById,
   readAllComments,
} from '@src/controllers'

/**
 * Handle all routes
 * @param router
 */
export const routes = (router: Router) => {
   // Health check
   router.get('/api/health', healthCheck)

   // Author routes ------------------------------------------------
   // Create author
   router.post('/api/author', createAuthorValidatorMiddleware, createAuthor)

   // Get all authors
   router.get('/api/authors', authenticationMiddleware, getAllAuthors)

   // Get author by id
   router.get('/api/author/:id', authenticationMiddleware, authorIdValidatorMiddleware, getAuthorById)

   // Article routes ------------------------------------------------
   // Create article
   router.post('/api/article', authenticationMiddleware, createArticleValidatorMiddleware, createArticle)

   // Get all articles
   router.get('/api/articles', authenticationMiddleware, getAllArticles)

   // Get article by id
   router.get('/api/article/:id', authenticationMiddleware, articleIdValidatorMiddleware, getArticleById)

   // Detete article by id (ONLY FOR ADMIN)
   router.delete(
      '/api/article/:id',
      authenticationMiddleware,
      permissionsMiddleware,
      deleteArticleValidatorMiddleware,
      deleteArticleById,
   )

   // Comment routes ------------------------------------------------
   // Create comment
   router.post('/api/comment', createCommentValidatorMiddleware, createComment)

   // Get all comments
   router.get('/api/comments', readAllComments)

   // Get comment by id
   router.get('/api/comment/:id', getCommentByIdValidatorMiddleware, readCommentById)
}
