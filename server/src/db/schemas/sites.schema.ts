import { integer, pgTable, varchar } from 'drizzle-orm/pg-core'

import { defaultColumns } from '@/lib/sql'

export const sitesTable = pgTable('sites', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar().notNull().unique(),
  code: varchar().notNull().unique(),
  ...defaultColumns,
})
