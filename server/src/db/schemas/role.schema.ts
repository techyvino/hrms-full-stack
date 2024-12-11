import { integer, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core'

export const roleTypeTable = pgTable('role_type', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar().notNull().unique(),
  code: varchar().notNull().unique(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).$onUpdateFn(
    () => new Date()
  ),
})
