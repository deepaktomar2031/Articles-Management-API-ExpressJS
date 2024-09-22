import { DatabaseService } from '@src/services/databaseService'
import { TableName } from '@src/types'
import type { ArticleEntry } from '@src/types'

export class ArticleAdapter extends DatabaseService<ArticleEntry> {
   constructor() {
      super(TableName.ARTICLE)
   }
}

export const articleAdapter: ArticleAdapter = new ArticleAdapter()
