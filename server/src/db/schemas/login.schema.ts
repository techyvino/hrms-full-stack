import {
  doublePrecision,
  integer,
  pgTable,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core'

import { usersTable } from '@/db/schemas/user.schema'

export const loginLogs = pgTable('login_logs', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  user_id: integer('user_id')
    .references(() => usersTable.id)
    .notNull(),
  login_time: timestamp('login_time'),
  logout_time: timestamp('logout_time'),
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
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).$onUpdateFn(
    () => new Date()
  ),
})
