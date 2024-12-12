import { desc, eq } from 'drizzle-orm'
import { describeRoute } from 'hono-openapi'
import { resolver } from 'hono-openapi/zod'

import { db } from '@/db'
import { activityLogTable } from '@/db/schemas/activity.schema'
import { createRouter } from '@/lib/create-app'
import { respondHandler } from '@/lib/http-status'
import { clockedInStatusResponseSchema } from '@/routes/activity/zod'

const activityRouter = createRouter()
const tags = ['Activity']

activityRouter.get(
  '/clocked-status',
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
    const userId = c.var.user.id

    try {
      // check if user is already clocked in
      const [recentClockedLog] = await db
        .select()
        .from(activityLogTable)
        .where(eq(activityLogTable.user_id, userId))
        .orderBy(desc(activityLogTable.updatedAt))

      const data = {
        is_clocked_in: !!recentClockedLog?.clock_in,
        clocked_in_at: recentClockedLog?.clock_in,
        clocked_out_at: recentClockedLog?.clock_out,
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
  '/clock-in',
  describeRoute({
    summary: 'Clock-in',
    description: 'Clock-in user',
    tags,
  }),
  async (c) => {
    const body = await c.req.json()
    const { id } = c.var.user

    try {
      // check if user is already clocked in
      const [lastClockedInInfo] = await db
        .select()
        .from(activityLogTable)
        .where(eq(activityLogTable.user_id, id))
        .orderBy(desc(activityLogTable.updatedAt))

      if (lastClockedInInfo.clock_in && !lastClockedInInfo.clock_out) {
        return respondHandler(c, 'conflict', 'Already clocked in')
      }
      await db
        .insert(activityLogTable)
        .values({ user_id: id, ...body })
        .returning()

      return respondHandler(c, 'success', 'Clock-in successfully')
    } catch (error) {
      if (error) {
        return c.json({ error }, 400)
      }
    }
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
