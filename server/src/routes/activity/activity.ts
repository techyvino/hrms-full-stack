import type { NeonDbError } from '@neondatabase/serverless'
import { desc, eq, getTableColumns, sql } from 'drizzle-orm'
import { describeRoute } from 'hono-openapi'
import { resolver, validator } from 'hono-openapi/zod'
import type { z } from 'zod'

import { db } from '@/db'
import { activityLogTable } from '@/db/schemas/activity.schema'
import { createRouter } from '@/lib/create-app'
import { dbError } from '@/lib/error-handling'
import { respondHandler } from '@/lib/http-status'
import { formatZodErrors } from '@/lib/utils'
import {
  clockedInStatusResponseSchema,
  punchClockRequestSchema,
} from '@/routes/activity/zod'

const activityRouter = createRouter()
const tags = ['Activity']

activityRouter.get(
  '/clockStatus',
  describeRoute({
    summary: 'Clocked status',
    description: 'Get clocked status by id',
    tags,
    responses: {
      200: {
        description: 'Successfully get Clocked status',
        content: {
          'application/json': {
            schema: resolver(clockedInStatusResponseSchema),
          },
        },
      },
    },
  }),
  // validator('param', paramUserIdSchema, (result, c) => {
  //   if (!result.success) {
  //     return c.json(formatZodErrors(result?.error), 400)
  //   }
  // }),
  async (c) => {
    const userId = c.var.user.id

    // const today = new Date()
    // const startOfDay = new Date(
    //   today.getFullYear(),
    //   today.getMonth(),
    //   today.getDate()
    // )

    try {
      const { clock_in, clock_out, createdAt, updatedAt, user_id, id } =
        getTableColumns(activityLogTable)
      // check if user is already clocked in
      const todayLogs = await db
        .select({
          clock_in,
          clock_out,
          createdAt,
          updatedAt,
          user_id,
          id,
          istTimeStamp: sql<number>`${activityLogTable.createdAt} AT TIME ZONE 'Asia/Kolkata'`,
          adjustedTimestamp: sql<number>`${activityLogTable.createdAt} + INTERVAL '5 hours 30 minutes'`,
        })
        .from(activityLogTable)
        .where(eq(activityLogTable.user_id, userId))
        .orderBy(desc(activityLogTable.updatedAt))

      const nextClockAction = todayLogs[0]?.clock_in ? 'out' : 'in'
      const data = {
        entries: todayLogs,
        next_clock_action: nextClockAction,
        clock_in_time: todayLogs[0]?.clock_in,
        clock_out_time: todayLogs[0]?.clock_out,
        istTimeStamp: todayLogs[0]?.istTimeStamp,
        adjusted_clock_in_time: todayLogs[0]?.adjustedTimestamp,
      }

      return respondHandler(c, 'success', data)
    } catch (error) {
      if (error) {
        return c.json({ error }, 400)
      }
    }
  }
)

activityRouter.post(
  '/punchClock',
  describeRoute({
    summary: 'Clock-Punch',
    description: 'clock-in / clock-out',
    tags,
  }),
  validator('json', punchClockRequestSchema, (result, c) => {
    if (!result.success) {
      return c.json(formatZodErrors(result?.error), 400)
    }
  }),
  async (c) => {
    const body: z.infer<typeof punchClockRequestSchema> = await c.req.json()
    const userId = c.var?.user?.id

    try {
      // check if user is already clocked in
      const { id, user_id, createdAt, updatedAt, clock_in, clock_out } =
        getTableColumns(activityLogTable)
      const lastClockedInInfo = await db
        .select({
          id,
          user_id,
          createdAt,
          updatedAt,
          clock_in,
          clock_out,
          updated_on_ist: sql`date_trunc('day', ${activityLogTable.updatedAt})::date AS truncated_date`,
        })
        .from(activityLogTable)
        .where(eq(activityLogTable.user_id, userId))
        .orderBy(desc(activityLogTable.updatedAt))

      console.log('lastClockedInInfo', lastClockedInInfo)

      await db
        .insert(activityLogTable)
        .values({ user_id: userId, ...body })
        .returning()

      return respondHandler(c, 'success', body)
    } catch (error) {
      respondHandler(c, 'bad_request', dbError(error as NeonDbError))
    }

    // try {
    //   // check if user is already clocked in
    //   const [lastClockedInInfo] = await db
    //     .select()
    //     .from(activityLogTable)
    //     .where(eq(activityLogTable.user_id, id))
    //     .orderBy(desc(activityLogTable.updatedAt))

    //   if (lastClockedInInfo.clock_in && !lastClockedInInfo.clock_out) {
    //     return respondHandler(c, 'conflict', 'Already clocked in')
    //   }
    //   await db
    //     .insert(activityLogTable)
    //     .values({ user_id: id, ...body })
    //     .returning()

    //   return respondHandler(c, 'success', 'Clock-in successfully')
    // } catch (error) {
    //   respondHandler(c, 'bad_request', dbError(error as NeonDbError))
    // }
  }
)

activityRouter.post(
  '/clock-out',
  describeRoute({
    summary: 'Clock-out',
    description: 'Clock-out user',
    tags,
  }),
  async (c) => {
    const body = await c.req.json()
    const { id } = c.var.user

    try {
      const [lastClockedInInfo] = await db
        .select()
        .from(activityLogTable)
        .where(eq(activityLogTable.user_id, id))
        .orderBy(desc(activityLogTable.updatedAt))

      if (!lastClockedInInfo.clock_in && lastClockedInInfo.clock_out) {
        return respondHandler(c, 'conflict', 'Already clocked out')
      }
      await db
        .insert(activityLogTable)
        .values({ user_id: id, ...body })
        .returning()

      return respondHandler(c, 'success', 'Clock-out successfully')
    } catch (error) {
      if (error) {
        return c.json({ error }, 400)
      }
    }
  }
)

export default activityRouter
