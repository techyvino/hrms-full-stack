import { z } from "zod"

import { genderEnumSchema, maritalStatusEnumSchema, userIdentificationsEnumSchema } from "@/lib/options"
import { transformEmptyStringToNull, transformTrimmedString } from "@/lib/utils"

export const signUpValuesSchema = z.object({
  name: transformTrimmedString(),
  password: transformTrimmedString(),
  dob: transformTrimmedString(),
  gender: genderEnumSchema,
  marital_status: maritalStatusEnumSchema,
  is_a_manager: z.boolean(),
  spouse_name: transformEmptyStringToNull(),
  spouse_dob: transformEmptyStringToNull(),
  number_of_dependents: z.number(),
  joined_date: transformTrimmedString(),
  emergency_contact_name: transformTrimmedString(),
  emergency_contact_no: transformTrimmedString(),
  alternate_contact_name: transformEmptyStringToNull(),
  alternate_contact_no: transformEmptyStringToNull(),
  temporary_address: transformTrimmedString(),
  temporary_city: transformTrimmedString(),
  temporary_state: transformTrimmedString(),
  temporary_country: transformTrimmedString(),
  temporary_postal_code: transformTrimmedString(),
  permanent_address: transformTrimmedString(),
  permanent_city: transformTrimmedString(),
  permanent_state: transformTrimmedString(),
  permanent_country: transformTrimmedString(),
  permanent_postal_code: transformTrimmedString(),
  mobile_no: transformTrimmedString(),
  email: transformTrimmedString(),
  department: transformTrimmedString(),
  designation: transformTrimmedString(),
  hobbies: transformEmptyStringToNull(),
  known_languages: transformTrimmedString(),
  identification_type: userIdentificationsEnumSchema,
  identification_number: transformTrimmedString(),
  site_id: z.number(),
  platform: transformEmptyStringToNull(),
  operating_system: transformEmptyStringToNull(),
  os_version: transformEmptyStringToNull(),
  manufacturer: transformEmptyStringToNull(),
  device_name: transformEmptyStringToNull(),
  device_model: transformEmptyStringToNull(),
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
    message: "User ID is required",
  }),
  old_password: z.string({
    message: "Old Password is required",
  }),
  new_password: z.string({
    message: "New Password is required",
  }),
})

export const forgotPasswordSchema = z.object({
  username: z.string({
    message: "Username is required",
  }),
  verification_code: z.string({
    message: "Verification code is required",
  }),
  new_password: z.string({
    message: "New Password is required",
  }),
})
