import {
  doublePrecision,
  integer,
  pgTable,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core'

import { usersTable } from '@/db/schemas/user.schema'

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
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .$onUpdateFn(() => new Date())
    .notNull(),
})
