import type { NeonDbError } from '@neondatabase/serverless'
import { sql } from 'drizzle-orm'
import { describeRoute } from 'hono-openapi'
import { resolver } from 'hono-openapi/zod'
import type { z } from 'zod'

import { activityLogTable } from '@/db/schemas/activity.schema'
import { createRouter } from '@/lib/create-app'
import { dbError } from '@/lib/error-handling'
import { respondHandler } from '@/lib/http-status'
import { calculateMinutes } from '@/lib/time-utils'
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
    const userId = Number(c.var?.user?.id)
    if (!userId) {
      return respondHandler(c, 'unauthorized', 'Unauthorized')
    }
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
  '/attendance/:id',
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
        clockedDates: sql<string>`date_trunc('day', ${activityLogTable.clock_in})::date`,
      }
    )

    const uniqueEntries = [
      ...new Set(entries.map((entry) => entry.clockedDates)),
    ]

    const entriesByDate = uniqueEntries?.map((date) => {
      return {
        date,
        entries: entries
          ?.filter((punch) => punch?.clockedDates?.includes(date))
          ?.map((punch) => ({
            id: punch?.id,
            clockIn: punch?.clock_in,
            clockOut: punch?.clock_out,
            durationInMinutes: calculateMinutes(
              punch?.clock_out,
              punch?.clock_in
            ),
          })),
      }
    })

    const entriesWithDuration = entriesByDate.map((date) => ({
      ...date,
      totalDurationInMinutes: date.entries.reduce(
        (acc, cur) => acc + cur?.durationInMinutes,
        0
      ),
    }))

    return respondHandler(c, 'success', entriesWithDuration)
  }
)

export default activityRouter
