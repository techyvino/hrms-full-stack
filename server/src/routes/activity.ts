import { eq } from "drizzle-orm"
import { Hono } from "hono"

import { db } from "@/db"
import { activityLogTable, usersTable } from "@/db/schemas"

const activityRouter = new Hono()
activityRouter.post("/clock-in", async (c) => {
  const body = await c.req.json()
  try {
    const result = await db
      .update(usersTable)
      .set({ ...body })
      .where(eq(usersTable.mobile_no, body.mobile_no))
      .returning()
    if (result?.length === 0) {
      return c.json({ message: "User not found" }, 400)
    }

    if (result) await db.insert(activityLogTable).values(body)
    return c.json({
      message: "Clock-in successfully",
    })
  } catch (error) {
    if (error) return c.json({ error }, 400)
  }
})

activityRouter.post("/clock-out", async (c) => {
  const body = await c.req.json()
  const result = await db
    .update(usersTable)
    .set({ ...body })
    .where(eq(usersTable.mobile_no, body.mobile_no))
    .returning()

  if (result.length === 0) {
    return c.json({ message: "User not found" }, 400)
  }

  await db.insert(activityLogTable).values(body)

  if (result)
    return c.json({
      message: "Clock-in successfully",
    })
})

activityRouter.get("/", async (req) => {
  return req.json({ message: "Hello Activity!" })
})

export default activityRouter
