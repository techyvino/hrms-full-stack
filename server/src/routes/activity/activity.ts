import type { NeonDbError } from '@neondatabase/serverless'
import { and, desc, eq, getTableColumns, gte, lte, sql } from 'drizzle-orm'
import { describeRoute } from 'hono-openapi'
import { resolver, validator } from 'hono-openapi/zod'
import type { z } from 'zod'

import { db } from '@/db'
import { activityLogTable } from '@/db/schemas/activity.schema'
import { createRouter } from '@/lib/create-app'
import { dbError } from '@/lib/error-handling'
import { respondHandler } from '@/lib/http-status'
import { dateTimeNow, formatZodErrors } from '@/lib/utils'
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

    try {
      const { clock_in, clock_out, updatedAt, id } =
        getTableColumns(activityLogTable)
      // check if user is already clocked in
      const todayLogs = await db
        .select({
          clock_in,
          clock_out,
          date: sql`date_trunc('day', ${activityLogTable.createdAt})::date`,
          updatedAt,
          id,
        })
        .from(activityLogTable)
        .where(eq(activityLogTable.user_id, userId))
        .orderBy(desc(activityLogTable.updatedAt))

      const nextClockAction =
        todayLogs[0]?.clock_in && !todayLogs[0]?.clock_out ? 'out' : 'in'

      const data = {
        entries: todayLogs,
        next_clock_action: nextClockAction,
        clock_in_time: todayLogs[0]?.clock_in,
        clock_out_time: todayLogs[0]?.clock_out,
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
    const { clock_action, ...body }: z.infer<typeof punchClockRequestSchema> =
      await c.req.json()
    const userId = c.var?.user?.id

    const today = dateTimeNow()
    const startOfDay = new Date(today.setHours(0, 0, 0, 0))
    const endOfDay = new Date(today.setHours(23, 59, 59, 999))

    try {
      // check if user is already clocked in
      const { id, user_id, createdAt, updatedAt, clock_in, clock_out } =
        getTableColumns(activityLogTable)

      const [lastClockedInInfo] = await db
        .select({
          id,
          user_id,
          createdAt,
          updatedAt,
          clock_in,
          clock_out,
        })
        .from(activityLogTable)
        .where(
          and(
            eq(activityLogTable.user_id, userId),
            gte(activityLogTable.clock_in, startOfDay),
            lte(activityLogTable.clock_in, endOfDay)
          )
        )
        .orderBy(desc(activityLogTable.updatedAt))

      if (clock_action === 'in') {
        // clock-in
        if (lastClockedInInfo?.clock_in && !lastClockedInInfo?.clock_out) {
          return respondHandler(c, 'conflict', 'Already clocked in')
        } else {
          await db
            .insert(activityLogTable)
            .values({
              ...body,
              user_id: userId,
              clock_in: dateTimeNow(),
              clock_out: null,
            })
            .returning()
        }
      }

      if (clock_action === 'out') {
        // clock-out
        if (lastClockedInInfo?.clock_out && !lastClockedInInfo?.clock_in) {
          return respondHandler(c, 'conflict', 'Already clocked out')
        } else {
          await db
            .update(activityLogTable)
            .set({ ...body, user_id: userId, clock_out: dateTimeNow() })
            .where(eq(activityLogTable.id, lastClockedInInfo.id))
            .returning()
        }
      }

      return respondHandler(c, 'success', 'Punched successful')
    } catch (error) {
      respondHandler(c, 'bad_request', dbError(error as NeonDbError))
    }
  }
)

export default activityRouter
