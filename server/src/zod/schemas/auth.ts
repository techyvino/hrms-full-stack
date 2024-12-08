import { z } from "zod"

import { transformEmptyStringToNull, transformTrimmedString } from "@/lib/utils"

export const loginSchema = z.object({
  username: transformTrimmedString(),
  password: transformTrimmedString(),
  platform: transformEmptyStringToNull(),
  operating_system: transformEmptyStringToNull(),
  os_version: transformEmptyStringToNull(),
  manufacturer: transformEmptyStringToNull(),
  device_name: transformEmptyStringToNull(),
  device_model: transformEmptyStringToNull(),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),
  locality: transformEmptyStringToNull(),
  area: transformEmptyStringToNull(),
  postal_code: transformEmptyStringToNull(),
})

export const refreshTokenSchema = z.object({
  refresh_token: transformTrimmedString(z.string().min(1, { message: "Refresh token is required" })),
})
