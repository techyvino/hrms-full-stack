import { eq, getTableColumns } from 'drizzle-orm'
import type { Context } from 'hono'

import { db } from '@/db'
import { usersTable } from '@/db/schemas/user.schema'
import { verifyToken } from '@/lib/auth'

export const authMiddleware = async (c: Context, next: () => Promise<void>) => {
  const path = c.req.path.toString()

  const excludePaths = [
    '/api/auth/login',
    '/api/auth/reset-password',
    '/api/auth/refresh-token',
    '/api/user/register',
    '/api/user/add-site',
    '/api/user/add-role',
  ]

  // Exclude login and register routes
  if (excludePaths.includes(path)) {
    return await next()
  }

  // Check for JWT
  const token = c.req.header('Authorization')?.replace('Bearer ', '')
  if (!token) {
    return c.json({ message: 'Unauthorized: No token provided' }, 401)
  }

  try {
    // Verify the token
    const payload = await verifyToken(token)
    if (!payload) {
      return c.json({ message: 'Unauthorized: Token not found' }, 401)
    }

    const { id, access_token } = getTableColumns(usersTable)
    const [user] = await db
      .select({ id, access_token })
      .from(usersTable)
      .where(eq(id, payload?.id))

    // Check if the user exists and has access token
    if (!user?.access_token) {
      return c.json(
        {
          message: 'Unauthorized: Invalid token',
          details: {
            name: 'Given token does not exist',
          },
        },
        401
      )
    }

    const databaseToken = await verifyToken(user?.access_token)

    // Check user already logged in and not logout properly
    if (databaseToken?.session_id !== payload?.session_id) {
      return c.json(
        {
          message: 'Unauthorized: Authentication expired',
          details: {
            name: 'Authentication expired',
          },
        },
        401
      )
    }

    c.set('user', payload) // Store payload in context for later use
    await next()
  } catch (error) {
    return c.json({ message: 'Unauthorized user', details: error }, 401)
  }
}
