import { sql } from 'drizzle-orm'
import { timestamp } from 'drizzle-orm/pg-core'

export const setIstTimeZone = sql`now() AT TIME ZONE 'Asia/Kolkata'`
//  sql`now() AT TIME ZONE 'Asia/Kolkata' + INTERVAL '5 hours 30 minutes'

export const defaultColumns = {
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).$onUpdateFn(
    () => new Date()
  ),
}
