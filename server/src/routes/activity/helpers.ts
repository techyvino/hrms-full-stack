import type { SQL } from 'drizzle-orm'
import { and, desc, eq, getTableColumns, gte, lte, sql } from 'drizzle-orm'
import type { PgColumn } from 'drizzle-orm/pg-core'
import type { Context } from 'hono'
import type { z } from 'zod'

import { db } from '@/db'
import { activityLogTable } from '@/db/schemas/activity.schema'
import { respondHandler } from '@/lib/http-status'
import { dateTimeNow } from '@/lib/utils'
import type { punchClockRequestSchema } from '@/routes/activity/zod'

export interface PunchInfo {
  id: number
  user_id: number
  clock_in: Date | null
  clock_out: Date | null
}

export type PunchBody = Omit<
  z.infer<typeof punchClockRequestSchema>,
  'clock_action'
>

export const getTodayPunchStatus = async (userId: number) => {
  // check if user is already clocked in
  const { id, updatedAt, clock_in, clock_out } =
    getTableColumns(activityLogTable)

  return await db
    .select({
      clock_in,
      clock_out,
      date: sql`date_trunc('day', ${activityLogTable.createdAt})::date`,
      updatedAt,
      id,
    })
    .from(activityLogTable)
    .where(
      and(
        eq(activityLogTable.user_id, userId),
        sql`date_trunc('day', ${activityLogTable.createdAt})::date = current_date`
      )
    )
    .orderBy(desc(activityLogTable.updatedAt))
}

export const getPunchStatusBetweenDates = async <
  TColumns extends Record<string, PgColumn | SQL | SQL.Aliased>,
>(
  userId: number,
  startOfDay: Date,
  endOfDay: Date,
  columns: TColumns = {} as TColumns
) => {
  const defaultFields = {
    ...columns,
    id: activityLogTable.id,
    user_id: activityLogTable.user_id,
    clock_in: activityLogTable.clock_in,
    clock_out: activityLogTable.clock_out,
  }

  type ResultType = {
    [K in keyof typeof defaultFields]: (typeof defaultFields)[K] extends PgColumn<
      infer TConfig
    >
      ? TConfig['data']
      : (typeof defaultFields)[K] extends SQL<infer TSQL>
        ? TSQL
        : (typeof defaultFields)[K] extends SQL.Aliased<infer TAliased>
          ? TAliased
          : string
  }

  const result = await db
    .select(defaultFields)
    .from(activityLogTable)
    .where(
      and(
        eq(activityLogTable.user_id, userId),
        gte(activityLogTable.createdAt, startOfDay),
        lte(
          activityLogTable.createdAt,
          new Date(endOfDay.setHours(23, 59, 59, 999))
        )
      )
    )
    .orderBy(desc(activityLogTable.updatedAt))

  return result as ResultType[]
}

export const handleClockIn = async (
  c: Context,
  lastClockedInInfo: PunchInfo,
  body: PunchBody
) => {
  if (lastClockedInInfo?.clock_in && !lastClockedInInfo?.clock_out) {
    return respondHandler(c, 'conflict', 'Already clocked in')
  }

  return await db
    .insert(activityLogTable)
    .values({
      ...body,
      clock_in: dateTimeNow(),
      clock_out: null,
    })
    .returning()
}

export const handleClockOut = async (
  c: Context,
  lastClockedInInfo: PunchInfo,
  body: PunchBody
) => {
  if (lastClockedInInfo?.clock_out && !lastClockedInInfo?.clock_in) {
    return respondHandler(c, 'conflict', 'Already clocked out')
  }

  return await db
    .update(activityLogTable)
    .set({ ...body, clock_out: dateTimeNow() })
    .where(eq(activityLogTable.id, lastClockedInInfo.id))
    .returning()
}
