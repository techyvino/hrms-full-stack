import type { NeonDbError } from '@neondatabase/serverless'
import { eq, or } from 'drizzle-orm'
import { describeRoute } from 'hono-openapi'
import { resolver, validator as zValidator } from 'hono-openapi/zod'
import type { z } from 'zod'

import { db } from '@/db'
import { loginLogs } from '@/db/schemas/login.schema'
import { usersTable } from '@/db/schemas/user.schema'
import {
  generateHashedPassword,
  generateToken,
  verifyPassword,
} from '@/lib/auth'
import { createRouter } from '@/lib/create-app'
import { dbError } from '@/lib/error-handling'
import { respondHandler } from '@/lib/http-status'
import { dateTimeNow, formatZodErrors, getRandomString } from '@/lib/utils'
import {
  changePasswordSchema,
  forgotPasswordSchema,
  loginRequestSchema,
  loginResponseSuccessSchema,
  responseSchema,
} from '@/routes/auth/zod'
import { envVariables } from '@/zod/env'

const authRouter = createRouter()
const tags = ['Authentication']

// login
authRouter.post(
  '/login',
  describeRoute({
    summary: 'Login',
    description: 'Login to the system',
    tags,
    responses: {
      200: {
        description: 'User logged in successfully',
        content: {
          'application/json': {
            schema: resolver(loginResponseSuccessSchema),
          },
        },
      },
    },
  }),
  zValidator('json', loginRequestSchema, (result, c) => {
    if (!result.success) {
      return c.json(formatZodErrors(result?.error), 400)
    }
  }),
  async (c) => {
    const { username, password, ...rest }: z.infer<typeof loginRequestSchema> =
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
        return respondHandler(c, 'not_found', 'Invalid username')
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
            return respondHandler(
              c,
              'forbidden',
              'Account locked due to too many failed login attempts'
            )
          }
        }

        const errorMessage = {
          ...(Number(envVariables.MAXIMUM_LOGIN_ATTEMPTS || 0) && {
            remaining_login_attempts:
              Number(envVariables.MAXIMUM_LOGIN_ATTEMPTS) - user.login_attempts,
          }),
        }
        return respondHandler(c, 'forbidden', errorMessage)
      }

      // Check if the user is already logged in
      if (user?.access_token) {
        await db.update(loginLogs).set({ logoutAt: dateTimeNow() })
      }

      const jwtPayload = {
        id: user.id,
        name: user.name,
        email: user.email,
        role_id: user.role_id,
        session_id: getRandomString(),
      }

      const access_token = await generateToken(jwtPayload)

      // Insert Login logs
      await db.insert(loginLogs).values({
        user_id: user.id,
        session_id: jwtPayload?.session_id,
        loginAt: dateTimeNow(),
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

      const data = {
        access_token,
        user: {
          name: user.name,
          email: user.email,
          user_id: user.id,
          role_id: user.role_id,
        },
      }

      return respondHandler(c, 'success', data)
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
    tags,
    responses: {
      200: {
        description: 'Password changed successfully',
        content: {
          'application/json': {
            schema: resolver(responseSchema),
          },
        },
      },
    },
  }),
  zValidator('json', changePasswordSchema, (result, c) => {
    if (!result.success) {
      return c.json(formatZodErrors(result?.error), 400)
    }
  }),
  async (c) => {
    const body: z.infer<typeof changePasswordSchema> = await c.req.json()
    const jwtPayload = c.var.user

    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, jwtPayload.id))
      .limit(1)

    if (!user) {
      return respondHandler(c, 'unauthorized')
    }
    const passwordMatch = await verifyPassword(
      body?.old_password,
      user?.password
    )
    if (!passwordMatch) {
      return respondHandler(c, 'bad_request', 'Incorrect old password')
    }

    const hashedPassword = await generateHashedPassword(body?.new_password)

    await db
      .update(usersTable)
      .set({
        password: hashedPassword,
      })
      .where(eq(usersTable.id, jwtPayload.id)) // except mobile_no and email (i-e non unique values)
      .returning()

    return respondHandler(c, 'success', 'Password updated successfully')
  }
)

// reset password
authRouter.post(
  '/reset-password',
  describeRoute({
    summary: 'Reset Password',
    description: 'Reset password with verification code',
    tags,
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
  describeRoute({
    summary: 'Logout',
    description: 'Logout current session',
    tags,
    responses: {
      200: {
        description: 'Logout successfully',
        content: {
          'application/json': {
            schema: resolver(responseSchema),
          },
        },
      },
    },
  }),
  async (c) => {
    const session = c.var.user

    try {
      const [user] = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.id, session?.id))
        .limit(1)

      if (!user) {
        return c.json(
          {
            message: 'Invalid username',
          },
          401
        )
      }

      await db
        .update(loginLogs)
        .set({ loginAt: dateTimeNow() })
        .where(eq(loginLogs.session_id, session?.session_id))
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
