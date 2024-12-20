import type { NeonDbError } from '@neondatabase/serverless'
import { sql } from 'drizzle-orm'
import { describeRoute } from 'hono-openapi'
import { resolver } from 'hono-openapi/zod'
import type { z } from 'zod'

import { activityLogTable } from '@/db/schemas/activity.schema'
import { createRouter } from '@/lib/create-app'
import { dbError } from '@/lib/error-handling'
import { respondHandler } from '@/lib/http-status'
import { dateTimeNow } from '@/lib/utils'
import { zodValidator } from '@/middleware/zod-validator'
import {
  getPunchStatusBetweenDates,
  getTodayPunchStatus,
  handleClockIn,
  handleClockOut,
} from '@/routes/activity/helpers'
import {
  clockedInStatusResponseSchema,
  punchClockRequestSchema,
} from '@/routes/activity/zod'
import { startEndDateQuerySchema, userIdParamSchema } from '@/routes/user/zod'

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
  async (c) => {
    const userId = Number(c.var.user.id)
    try {
      const todayLogs = await getTodayPunchStatus(userId)

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
  zodValidator('json', punchClockRequestSchema),
  async (c) => {
    const { clock_action, ...body }: z.infer<typeof punchClockRequestSchema> =
      await c.req.json()

    const today = dateTimeNow()
    const startOfDay = new Date(today.setHours(0, 0, 0, 0))
    const endOfDay = new Date(today.setHours(23, 59, 59, 999))

    try {
      // check if user is already clocked in
      const [lastClockedInInfo] = await getPunchStatusBetweenDates(
        body.user_id,
        startOfDay,
        endOfDay
      )

      if (clock_action === 'in') {
        // clock-in
        handleClockIn(c, lastClockedInInfo, body)
      }

      if (clock_action === 'out') {
        // clock-out
        handleClockOut(c, lastClockedInInfo, body)
      }

      return respondHandler(c, 'success', 'Punched successful')
    } catch (error) {
      respondHandler(c, 'bad_request', dbError(error as NeonDbError))
    }
  }
)

activityRouter.get(
  '/getAttendance/:id',
  describeRoute({
    summary: 'Get Attendance Status',
    description: 'get attendance status by id and start and end date',
    tags,
  }),
  zodValidator('param', userIdParamSchema),
  zodValidator('query', startEndDateQuerySchema),
  async (c) => {
    const userId = Number(c.req.param('id'))
    const startDate = c.req.query('startDate') || ''
    const endDate = c.req.query('endDate') || ''

    const entries = await getPunchStatusBetweenDates(
      userId,
      new Date(startDate),
      new Date(endDate),
      {
        clock_in_date: sql<Date>`date_trunc('day', ${activityLogTable.clock_in})`,
      }
    )
    return respondHandler(c, 'success', entries[0])
  }
)

export default activityRouter
