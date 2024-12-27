import { doublePrecision, integer, pgTable, varchar } from 'drizzle-orm/pg-core'

import { usersTable } from '@/db/schemas/user.schema'
import { defaultColumns } from '@/lib/sql'

export const locationTrackerTable = pgTable('location_tracker', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  user_id: integer('user_id')
    .references(() => usersTable.id)
    .notNull(),
  latitude: doublePrecision(),
  longitude: doublePrecision(),
  speed: doublePrecision(),
  altitude: doublePrecision(),
  locality: varchar(),
  area: varchar(),
  postal_code: varchar('postal_code'),
  timestamp: varchar(),
  ...defaultColumns,
})
