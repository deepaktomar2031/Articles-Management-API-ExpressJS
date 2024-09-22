import type { Knex } from 'knex'
import * as bcrypt from 'bcrypt'

const tableName: string = 'author'

export async function up(knex: Knex): Promise<void> {
   const hashedPassword = await bcrypt.hash('admin', 10)
   await knex(tableName).insert({
      name: 'admin',
      email: 'user@admin.com',
      password: hashedPassword,
      is_admin: true,
   })
}

export async function down(knex: Knex): Promise<void> {
   await knex(tableName).where({ email: 'user@admin.com' }).del()
}
