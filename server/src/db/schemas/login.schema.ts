import {
  doublePrecision,
  integer,
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
  latitude: doublePrecision(),
  longitude: doublePrecision(),
  locality: varchar(),
  area: varchar(),
  postal_code: varchar('postal_code'),
  platform: varchar(),
  operating_system: varchar(),
  os_version: varchar(),
  manufacturer: varchar(),
  device_name: varchar(),
  device_model: varchar(),
  session_id: varchar(),
  ...defaultColumns,
})
