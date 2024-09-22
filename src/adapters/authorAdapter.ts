import { DatabaseService } from '@src/services/databaseService'
import { TableName } from '@src/types'
import type { AuthorEntry } from '@src/types'

export class AuthorAdapter extends DatabaseService<AuthorEntry> {
   constructor() {
      super(TableName.AUTHOR)
   }
}

export const authorAdapter: AuthorAdapter = new AuthorAdapter()
