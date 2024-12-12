import 'zod-openapi/extend'

import { z } from 'zod'

import { createTrimmedString } from '@/lib/utils'
import { responseSchema } from '@/routes/auth/zod'

// signup values
export const signUpValuesSchema = z.object({
  name: createTrimmedString(),
  password: createTrimmedString(),
  dob: createTrimmedString(),
  gender: z.string(),
  marital_status: z.string(),
  is_a_manager: z.boolean(),
  spouse_name: createTrimmedString().nullable().optional(),
  spouse_dob: createTrimmedString().nullable().optional(),
  number_of_dependents: z.number(),
  joined_date: createTrimmedString(),
  emergency_contact_name: createTrimmedString(),
  emergency_contact_no: createTrimmedString(),
  alternate_contact_name: createTrimmedString().nullable().optional(),
  alternate_contact_no: createTrimmedString().nullable().optional(),
  temporary_address: createTrimmedString(),
  temporary_city: createTrimmedString(),
  temporary_state: createTrimmedString(),
  temporary_country: createTrimmedString(),
  temporary_postal_code: createTrimmedString(),
  permanent_address: createTrimmedString(),
  permanent_city: createTrimmedString(),
  permanent_state: createTrimmedString(),
  permanent_country: createTrimmedString(),
  permanent_postal_code: createTrimmedString(),
  mobile_no: createTrimmedString(),
  email: createTrimmedString(),
  department: createTrimmedString(),
  designation: createTrimmedString(),
  hobbies: createTrimmedString().nullable().optional(),
  known_languages: createTrimmedString(),
  identification_type: z.string(),
  identification_number: createTrimmedString(),
  site_id: z.number(),
  role_id: z.number(),
  live_tracker_enabled: z.boolean(),
})

// Update user values schema
export const updateUserValuesSchema = signUpValuesSchema.omit({
  mobile_no: true,
  email: true,
  password: true,
})

// GET - Get user details by ID - Request
export const paramUserIdSchema = z.object({
  id: z.coerce.number({ message: 'User id is required' }),
})

// GET - Get user details by ID - Response
export const getUserDetailsResponse = responseSchema
  .omit({ message: true })
  .extend({
    data: z.object({
      user_id: z.coerce.number(),
      name: z.string(),
      dob: z.string(),
      gender: z.string(),
      marital_status: z.string(),
      is_a_manager: z.boolean(),
      spouse_name: z.string().nullable(),
      spouse_dob: z.string().nullable(),
      number_of_dependents: z.number(),
      joined_date: z.string(),
      emergency_contact_name: z.string(),
      emergency_contact_no: z.string(),
      alternate_contact_name: z.string().nullable(),
      alternate_contact_no: z.string().nullable(),
      temporary_address: z.string(),
      temporary_city: z.string(),
      temporary_state: z.string(),
      temporary_country: z.string(),
      temporary_postal_code: z.string(),
      permanent_address: z.string(),
      permanent_city: z.string(),
      permanent_state: z.string(),
      permanent_country: z.string(),
      permanent_postal_code: z.string(),
      mobile_no: z.string(),
      email: z.string(),
      department: z.string(),
      designation: z.string(),
      hobbies: z.string().nullable(),
      known_languages: z.string(),
      identification_type: z.string(),
      identification_number: z.string(),
      live_tracker_enabled: z.boolean(),
      site_id: z.number(),
      site_name: z.string(),
      site_code: z.string(),
      role_id: z.number(),
      role_name: z.string(),
      role_code: z.string(),
    }),
  })

// GET - Get user List - Response

export const getUserListResponse = responseSchema
  .omit({ message: true })
  .extend({
    data: z.array(
      z.object({
        id: z.number(),
        department: z.string(),
        designation: z.string(),
        email: z.string().email(),
        mobile_no: z.string(),
        gender: z.string(),
        joined_date: z.string(),
        live_tracker_enabled: z.boolean(),
        marital_status: z.string(),
        name: z.string(),
        status: z.string(),
        site_name: z.string(),
        role_name: z.string(),
      })
    ),
  })
