import { sql } from 'drizzle-orm'
import {
  doublePrecision,
  integer,
  pgTable,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core'

import { usersTable } from '@/db/schemas/user.schema'

export const activityLogTable = pgTable('activity_log', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  user_id: integer('user_id')
    .references(() => usersTable.id)
    .notNull(),
  clock_in: varchar('clock_in'),
  clock_out: varchar('clock_out'),
  latitude: doublePrecision(),
  longitude: doublePrecision(),
  speed: integer(),
  accuracy: integer(),
  altitude: integer(),
  locality: varchar(),
  area: varchar(),
  postal_code: varchar('postal_code'),
  createdAt: timestamp('created_at')
    .default(sql`now() AT TIME ZONE 'Asia/Kolkata'`)
    .notNull(),
  updatedAt: timestamp('updated_at')
    .$onUpdateFn(() => new Date())
    .notNull(),
})
