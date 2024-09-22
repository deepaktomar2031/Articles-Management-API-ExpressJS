import { DatabaseService } from '@src/services/databaseService'
import { TableName } from '@src/types'
import type { CommentEntry } from '@src/types'

export class CommentAdapter extends DatabaseService<CommentEntry> {
   constructor() {
      super(TableName.COMMENT)
   }
}

export const commentAdapter: CommentAdapter = new CommentAdapter()
