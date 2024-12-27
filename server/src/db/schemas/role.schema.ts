import { integer, pgTable, varchar } from 'drizzle-orm/pg-core'

import { defaultColumns } from '@/lib/sql'

export const roleTypeTable = pgTable('role_type', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar().notNull().unique(),
  code: varchar().notNull().unique(),
  ...defaultColumns,
})
