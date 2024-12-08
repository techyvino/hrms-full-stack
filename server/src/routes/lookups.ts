import { eq } from 'drizzle-orm'
import { Hono } from 'hono'

import { db } from '@/db'
import { roleTypeTable, sitesTable } from '@/db/schemas'

const lookupRouter = new Hono()

lookupRouter.post('/add-role', async (c) => {
  const body = await c.req.json()

  const isRoleExist = await db
    .select()
    .from(roleTypeTable)
    .where(eq(roleTypeTable.name, body.name))

  if (isRoleExist.length > 0) {
    return c.json({ message: 'Role already exist' }, 409)
  }

  await db.insert(roleTypeTable).values(body).returning()

  return c.json(
    {
      message: 'Role Created Successfully',
    },
    201
  )
})

lookupRouter.post('/add-site', async (c) => {
  const body = await c.req.json()

  const isExist = await db
    .select()
    .from(sitesTable)
    .where(eq(sitesTable.name, body.name))

  if (isExist.length > 0) {
    return c.json({ message: 'Already exist' }, 409)
  }

  await db.insert(sitesTable).values(body).returning()

  return c.json(
    {
      message: 'Created Successfully',
    },
    201
  )
})

lookupRouter.get('/', async (request) => {
  return request.json({ message: 'Hello lookup!' })
})

export default lookupRouter
