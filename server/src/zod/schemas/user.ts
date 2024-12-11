import { z } from 'zod'

import { createTrimmedString } from '@/lib/utils'

export const signUpValuesSchema = z.object({
  name: createTrimmedString(),
  password: createTrimmedString(),
  dob: createTrimmedString(),
  gender: z.string(),
  marital_status: z.string(),
  is_a_manager: z.boolean(),
  spouse_name: createTrimmedString().nullable(),
  spouse_dob: createTrimmedString().nullable(),
  number_of_dependents: z.number(),
  joined_date: createTrimmedString(),
  emergency_contact_name: createTrimmedString(),
  emergency_contact_no: createTrimmedString(),
  alternate_contact_name: createTrimmedString().nullable(),
  alternate_contact_no: createTrimmedString().nullable(),
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
  hobbies: createTrimmedString().nullable(),
  known_languages: createTrimmedString(),
  identification_type: z.string(),
  identification_number: createTrimmedString(),
  site_id: z.number(),
  platform: createTrimmedString().nullable(),
  operating_system: createTrimmedString().nullable(),
  os_version: createTrimmedString().nullable(),
  manufacturer: createTrimmedString().nullable(),
  device_name: createTrimmedString().nullable(),
  device_model: createTrimmedString().nullable(),
  role_id: z.number(),
  live_tracker_enabled: z.boolean(),
})

export const updateProfileSchema = z
  .object({
    id: z.number(),
  })
  .and(signUpValuesSchema)

export const updatePasswordSchema = z.object({
  user_id: z.number({
    message: 'User ID is required',
  }),
  old_password: z.string({
    message: 'Old Password is required',
  }),
  new_password: z.string({
    message: 'New Password is required',
  }),
})

export const forgotPasswordSchema = z.object({
  username: z.string({
    message: 'Username is required',
  }),
  verification_code: z.string({
    message: 'Verification code is required',
  }),
  new_password: z.string({
    message: 'New Password is required',
  }),
})
