import { integer, jsonb, pgTable, timestamp } from 'drizzle-orm/pg-core'

import { usersTable } from '@/db/schemas/user.schema'
import { defaultColumns } from '@/lib/sql'

export const activityLogTable = pgTable('activity_log', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  user_id: integer('user_id')
    .references(() => usersTable.id)
    .notNull(),
  clock_in: timestamp('clock_in', { withTimezone: true }),
  clock_out: timestamp('clock_out', { withTimezone: true }),
  clock_in_location: jsonb(),
  clock_out_location: jsonb(),
  clock_in_device: jsonb(),
  clock_out_device: jsonb(),
  ...defaultColumns,
})
