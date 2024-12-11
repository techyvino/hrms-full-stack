import type { NeonDbError } from '@neondatabase/serverless'
import { eq, or } from 'drizzle-orm'
import { describeRoute } from 'hono-openapi'
import { validator as zValidator } from 'hono-openapi/zod'
import type { z } from 'zod'

import { db } from '@/db'
import { loginLogs } from '@/db/schemas/login.schema'
import { usersTable } from '@/db/schemas/user.schema'
import type { JWTPayloadWithUser } from '@/lib/auth'
import {
  generateHashedPassword,
  generateToken,
  verifyPassword,
} from '@/lib/auth'
import { createRouter } from '@/lib/create-app'
import { dbError } from '@/lib/error-handling'
import { formatZodErrors, getRandomString } from '@/lib/utils'
import { loginSchema } from '@/routes/auth/zod'
import { envVariables } from '@/zod/env'
import { forgotPasswordSchema, updatePasswordSchema } from '@/zod/schemas/user'

const authRouter = createRouter()

// login
authRouter.post(
  '/login',
  describeRoute({
    summary: 'Login',
    description: 'Login to the system',
    responses: {
      200: {
        description: 'User logged in successfully',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                access_token: {
                  type: 'string',
                },
                user: {
                  type: 'object',
                  properties: {
                    name: {
                      type: 'string',
                    },
                    email: {
                      type: 'string',
                    },
                    user_id: {
                      type: 'number',
                    },
                    role_id: {
                      type: 'number',
                    },
                  },
                },
              },
            },
          },
        },
      },
      403: {
        description: 'Invalid Password',
      },
      404: {
        description: 'Invalid Username',
      },
      423: {
        description: 'Account Locked',
      },
    },
  }),
  zValidator('json', loginSchema, (result, c) => {
    if (!result.success) {
      return c.json(formatZodErrors(result?.error), 400)
    }
  }),
  async (c) => {
    const { username, password, ...rest }: z.infer<typeof loginSchema> =
      await c.req.json()

    try {
      const [user] = await db
        .select()
        .from(usersTable)
        .where(
          or(eq(usersTable.email, username), eq(usersTable.mobile_no, username))
        )
        .limit(1)

      if (!user) {
        return c.json(
          {
            message: 'Invalid username',
          },
          404
        )
      }

      const passwordMatch = await verifyPassword(password, user?.password)

      if (!passwordMatch) {
        // Login attempt validation
        if (Number(envVariables.MAXIMUM_LOGIN_ATTEMPTS || 0)) {
          await db
            .update(usersTable)
            .set({
              login_attempts: user.login_attempts + 1,
            })
            .where(eq(usersTable.id, user.id))
            .execute()
          if (
            Number(envVariables.MAXIMUM_LOGIN_ATTEMPTS) <= user.login_attempts
          ) {
            return c.json(
              {
                message:
                  'Account locked due to too many failed login attempts.',
              },
              429
            )
          }
        }

        const errorMessage = {
          message: 'Invalid password',
          ...(Number(envVariables.MAXIMUM_LOGIN_ATTEMPTS || 0) && {
            remaining_login_attempts:
              Number(envVariables.MAXIMUM_LOGIN_ATTEMPTS) - user.login_attempts,
          }),
        }
        return c.json(errorMessage, 403)
      }

      // Check if the user is already logged in
      if (user?.access_token) {
        await db.update(loginLogs).set({
          logout_time: new Date(),
        })
      }

      const jwtPayload = {
        id: user.id,
        name: user.name,
        email: user.email,
        session_id: getRandomString(),
      }

      const access_token = await generateToken(jwtPayload)

      // Insert Login logs
      await db.insert(loginLogs).values({
        user_id: user.id,
        login_time: new Date(),
        logout_time: null,
        session_id: jwtPayload?.session_id,
        ...rest,
      })

      // update token on db
      await db
        .update(usersTable)
        .set({
          status: 'active',
          login_attempts: 0,
          access_token,
          session_id: jwtPayload?.session_id,
          ...rest,
        })
        .where(eq(usersTable.id, user.id))
        .returning()

      return c.json(
        {
          message: 'Login success',
          data: {
            access_token,
            name: user.name,
            email: user.email,
            user_id: user.id,
            role_id: user.role_id,
          },
        },
        200
      )
    } catch (error) {
      return c.json({ error: dbError(error as NeonDbError) })
    }
  }
)

//change password
authRouter.post(
  '/change-password',
  describeRoute({
    summary: 'Change Password',
    description: 'Change password with old password',
  }),
  zValidator('json', updatePasswordSchema, (result, c) => {
    if (!result.success) {
      return c.json(formatZodErrors(result?.error), 400)
    }
  }),
  async (c) => {
    const body: z.infer<typeof updatePasswordSchema> = await c.req.json()

    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, body.user_id))
      .limit(1)

    if (!user) {
      return c.json({ message: 'User not found' }, 401)
    }
    const passwordMatch = await verifyPassword(
      body?.old_password,
      user?.password
    )
    if (!passwordMatch) {
      return c.json({ message: 'Incorrect old password' }, 400)
    }

    const hashedPassword = await generateHashedPassword(body?.new_password)

    await db
      .update(usersTable)
      .set({
        password: hashedPassword,
      })
      .where(eq(usersTable.id, body.user_id)) // except mobile_no and email (i-e non unique values)
      .returning()

    return c.json({ message: 'Password updated successfully' })
  }
)

// reset password
authRouter.post(
  '/reset-password',
  describeRoute({
    summary: 'Reset Password',
    description: 'Reset password with verification code',
    hide: true,
  }),
  zValidator('json', forgotPasswordSchema, (result, c) => {
    if (!result.success) {
      return c.json(formatZodErrors(result?.error), 400)
    }
  }),
  async (c) => {
    const {
      username,
      new_password,
      verification_code,
    }: z.infer<typeof forgotPasswordSchema> = await c.req.json()

    const [user] = await db
      .select()
      .from(usersTable)
      .where(
        or(eq(usersTable.email, username), eq(usersTable.mobile_no, username))
      )
      .limit(1)

    if (!user) {
      return c.json({ message: 'User not found' }, 401)
    }

    if (user.verification_code !== verification_code) {
      return c.json({ message: 'Invalid Verification code' }, 401)
    } // need to handle

    const hashedPassword = await generateHashedPassword(new_password)

    await db
      .update(usersTable)
      .set({
        password: hashedPassword,
      })
      .where(eq(usersTable.id, user.id)) // except mobile_no and email (i-e non unique values)
      .returning()

    return c.json({ message: 'Password reset successfully' })
  }
)

// logout
authRouter.post(
  '/logout',
  describeRoute({ summary: 'Logout', description: 'Logout current session' }),
  async (c) => {
    const { email, id } = (await c.var.jwtPayload) as JWTPayloadWithUser

    try {
      const [user] = await db
        .select()
        .from(usersTable)
        .where(or(eq(usersTable.email, email), eq(usersTable.id, id)))
        .limit(1)

      if (!user) {
        return c.json(
          {
            message: 'Invalid username',
          },
          404
        )
      }

      await db
        .update(loginLogs)
        .set({
          logout_time: new Date(),
        })
        .where(eq(loginLogs.user_id, user.id))
        .returning()

      await db
        .update(usersTable)
        .set({
          access_token: null,
        })
        .where(eq(usersTable.id, user.id))
        .returning()

      return c.json(
        {
          message: 'Logged out successfully',
        },
        200
      )
    } catch (error) {
      return c.json({ error: dbError(error as NeonDbError) }, 500)
    }
  }
)

export default authRouter
