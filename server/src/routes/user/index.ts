import type { NeonDbError } from '@neondatabase/serverless'
import { eq, getTableColumns } from 'drizzle-orm'
import { describeRoute } from 'hono-openapi'
import { resolver, validator } from 'hono-openapi/zod'
import type { z } from 'zod'

import { db } from '@/db'
import { roleTypeTable } from '@/db/schemas/role.schema'
import { sitesTable } from '@/db/schemas/sites.schema'
import { usersTable } from '@/db/schemas/user.schema'
import { generateHashedPassword } from '@/lib/auth'
import { createRouter } from '@/lib/create-app'
import { dbError } from '@/lib/error-handling'
import { respondHandler } from '@/lib/http-status'
import { formatZodErrors } from '@/lib/utils'
import { responseSchema } from '@/routes/auth/zod'
import {
  getUserDetailsResponse,
  getUserListResponse,
  signUpValuesSchema,
  updateUserValuesSchema,
} from '@/routes/user/zod'

const userRouter = createRouter()
const tags = ['User Management']

// register new user
userRouter.post(
  '/register',
  describeRoute({
    summary: 'Register new user',
    description: 'Register new user',
    tags,
    responses: {
      201: {
        description: 'User created successfully',
        content: {
          'application/json': {
            schema: resolver(responseSchema),
          },
        },
      },
    },
  }),
  validator('json', signUpValuesSchema, (result, c) => {
    if (!result.success) {
      return c.json(formatZodErrors(result?.error), 400)
    }
  }),
  async (c) => {
    const { password, ...rest }: z.infer<typeof signUpValuesSchema> =
      await c.req.valid('json')

    const isUserExist = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.mobile_no, rest.mobile_no))

    if (isUserExist.length > 0) {
      return respondHandler(c, 'conflict', 'User already exist')
    }

    const hashedPassword = await generateHashedPassword(password)

    try {
      await db
        .insert(usersTable)
        .values({ password: hashedPassword, ...rest })
        .returning()

      return respondHandler(c, 'created', 'User Created Successfully')
    } catch (error) {
      return respondHandler(c, 'server_error', dbError(error as NeonDbError))
    }
  }
)

// user profile update
userRouter.post(
  '/user',
  describeRoute({
    summary: 'Profile update',
    description: 'update user profile information',
    tags,
    responses: {
      200: {
        description: 'User profile updated successfully',
        content: {
          'application/json': {
            schema: resolver(responseSchema),
          },
        },
      },
    },
  }),
  validator('json', updateUserValuesSchema, (result, c) => {
    if (!result.success) {
      return c.json(formatZodErrors(result?.error), 400)
    }
  }),
  async (c) => {
    const body: z.infer<typeof signUpValuesSchema> = await c.req.json()
    const { id } = c.var.user

    try {
      const result = await db
        .update(usersTable)
        .set({ ...body })
        .where(eq(usersTable.id, id))
        .returning()

      if (result?.length === 0) {
        return respondHandler(c, 'unauthorized', 'User not found')
      }
      return respondHandler(c, 'success', 'User successfully updated')
    } catch (error) {
      if (error) {
        return respondHandler(c, 'server_error', dbError(error as NeonDbError))
      }
    }
  }
)

// get user info by id
userRouter.get(
  '/user',
  describeRoute({
    summary: 'Get user',
    description: 'Get user details by id',
    tags,
    responses: {
      200: {
        description: 'User details fetched successfully',
        content: {
          'application/json': {
            schema: resolver(getUserDetailsResponse),
          },
        },
      },
    },
  }),
  async (c) => {
    const userId = c.var.user.id

    if (!userId) {
      return respondHandler(c, 'not_found', 'Invalid user id')
    }

    try {
      const result = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.id, userId))
        .leftJoin(sitesTable, eq(usersTable.site_id, sitesTable.id))
        .leftJoin(roleTypeTable, eq(usersTable.role_id, roleTypeTable.id))

      if (result.length === 0) {
        return respondHandler(c, 'unauthorized', 'Invalid user')
      }

      const [{ users, sites, role_type }] = result

      const response = {
        user_id: users?.id,
        name: users?.name,
        dob: users?.dob,
        gender: users?.gender,
        marital_status: users?.marital_status,
        is_a_manager: users?.is_a_manager,
        spouse_name: users?.spouse_name,
        spouse_dob: users?.spouse_dob,
        number_of_dependents: users?.number_of_dependents,
        joined_date: users?.joined_date,
        emergency_contact_name: users?.emergency_contact_name,
        emergency_contact_no: users?.emergency_contact_no,
        alternate_contact_name: users?.alternate_contact_name,
        alternate_contact_no: users?.alternate_contact_no,
        temporary_address: users?.temporary_address,
        temporary_city: users?.temporary_city,
        temporary_state: users?.temporary_state,
        temporary_country: users?.temporary_country,
        temporary_postal_code: users?.temporary_postal_code,
        permanent_address: users?.permanent_address,
        permanent_city: users?.permanent_city,
        permanent_state: users?.permanent_state,
        permanent_country: users?.permanent_country,
        permanent_postal_code: users?.permanent_postal_code,
        mobile_no: users?.mobile_no,
        email: users?.email,
        department: users?.department,
        designation: users?.designation,
        hobbies: users?.hobbies,
        known_languages: users?.known_languages,
        identification_type: users?.identification_type,
        identification_number: users?.identification_number,
        live_tracker_enabled: users?.live_tracker_enabled,
        site_id: sites?.id,
        site_name: sites?.name,
        site_code: sites?.code,
        role_id: role_type?.id,
        role_name: role_type?.name,
        role_code: role_type?.code,
      }

      return c.json({ data: response })
    } catch (error) {
      return c.json({ error: dbError(error as NeonDbError) }, 500)
    }
  }
)

userRouter.get(
  '/users',
  describeRoute({
    summary: 'Get user list',
    description: 'Get all user list',
    tags,
    responses: {
      200: {
        description: 'User List fetched successfully',
        content: {
          'application/json': {
            schema: resolver(getUserListResponse),
          },
        },
      },
    },
  }),
  async (c) => {
    try {
      const {
        id,
        department,
        designation,
        email,
        mobile_no,
        gender,
        joined_date,
        live_tracker_enabled,
        marital_status,
        name,
        status,
      } = getTableColumns(usersTable)

      const result = await db
        .select({
          id,
          department,
          designation,
          email,
          mobile_no,
          gender,
          joined_date,
          live_tracker_enabled,
          marital_status,
          name,
          status,
          site_name: sitesTable.name,
          role_name: roleTypeTable.name,
        })
        .from(usersTable)
        .leftJoin(sitesTable, eq(usersTable.site_id, sitesTable.id))
        .leftJoin(roleTypeTable, eq(usersTable.role_id, roleTypeTable.id))

      if (result.length === 0) {
        return respondHandler(c, 'unauthorized', 'Invalid user')
      }
      return respondHandler(c, 'success', result)
    } catch (error) {
      return respondHandler(c, 'server_error', dbError(error as NeonDbError))
    }
  }
)

export default userRouter
