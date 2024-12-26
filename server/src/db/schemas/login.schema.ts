import {
  integer,
  jsonb,
  pgTable,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core'

import { usersTable } from '@/db/schemas/user.schema'
import { defaultColumns } from '@/lib/sql'

export const loginLogs = pgTable('login_logs', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  user_id: integer('user_id')
    .references(() => usersTable.id)
    .notNull(),
  loginAt: timestamp('login_at', { withTimezone: true }),
  logoutAt: timestamp('logout_at', { withTimezone: true }),
  location_info: jsonb(),
  device_info: jsonb(),
  session_id: varchar(),
  ...defaultColumns,
})
