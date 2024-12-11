import { zValidator } from '@hono/zod-validator'
import type { NeonDbError } from '@neondatabase/serverless'
import { eq } from 'drizzle-orm'
import { Hono } from 'hono'
import { z } from 'zod'

import { db } from '@/db'
import { roleTypeTable } from '@/db/schemas/role.schema'
import { sitesTable } from '@/db/schemas/sites.schema'
import { usersTable } from '@/db/schemas/user.schema'
import { generateHashedPassword } from '@/lib/auth'
import { dbError } from '@/lib/error-handling'
import { formatZodErrors } from '@/lib/utils'
import { signUpValuesSchema } from '@/zod/schemas/user'

const userRouter = new Hono()

// register new user
userRouter.post(
  '/register',
  zValidator('json', signUpValuesSchema, (result, c) => {
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
      return c.json({ message: 'User already exist' }, 409)
    }

    const hashedPassword = await generateHashedPassword(password)

    try {
      await db
        .insert(usersTable)
        .values({ password: hashedPassword, ...rest })
        .returning()

      return c.json(
        {
          message: 'User Created Successfully',
        },
        201
      )
    } catch (error) {
      return c.json({ error: dbError(error as NeonDbError) }, 500)
    }
  }
)

// user profile update
userRouter.post('/profile-update', async (c) => {
  const body: z.infer<typeof signUpValuesSchema> = await c.req.json()

  try {
    const result = await db
      .update(usersTable)
      .set({ ...body })
      .where(eq(usersTable.mobile_no, body.mobile_no))
      .returning()
    if (result?.length === 0) {
      return c.json({ message: 'User not found' }, 400)
    }
    return c.json({
      message: 'Profile Updated successfully',
    })
  } catch (error) {
    if (error) {
      return c.json({ error }, 400)
    }
  }
})

// get user info by id
userRouter.get(
  '/getUserDetail/:id',
  zValidator(
    'param',
    z.object({
      id: z.string(),
    }),
    (result, c) => {
      if (!result.success) {
        return c.json(formatZodErrors(result?.error), 400)
      }
    }
  ),
  async (c) => {
    const userId = Number(c.req.param('id') || 0)

    if (!userId) {
      return c.json({ message: 'Invalid user id' })
    }

    try {
      const result = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.id, userId))
        .leftJoin(sitesTable, eq(usersTable.site_id, sitesTable.id))
        .leftJoin(roleTypeTable, eq(usersTable.role_id, roleTypeTable.id))

      if (result.length === 0) {
        return c.json({ message: 'User details not found' }, 403)
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
        sites,
        role_type,
      }

      return c.json({ data: response })
    } catch (error) {
      return c.json({ error: dbError(error as NeonDbError) }, 500)
    }
  }
)

export default userRouter
