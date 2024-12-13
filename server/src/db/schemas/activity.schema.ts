import {
  doublePrecision,
  integer,
  pgTable,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core'

import { usersTable } from '@/db/schemas/user.schema'
import { defaultColumns } from '@/lib/sql'

export const activityLogTable = pgTable('activity_log', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  user_id: integer('user_id')
    .references(() => usersTable.id)
    .notNull(),
  clock_in: timestamp('clock_in', { withTimezone: true }),
  clock_out: timestamp('clock_out', { withTimezone: true }),
  latitude: doublePrecision(),
  longitude: doublePrecision(),
  speed: integer(),
  accuracy: integer(),
  altitude: integer(),
  locality: varchar(),
  area: varchar(),
  postal_code: varchar('postal_code'),
  ...defaultColumns,
})
