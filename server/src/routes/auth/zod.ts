import 'zod-openapi/extend'

import { z } from 'zod'

import { createTrimmedString } from '@/lib/utils'

export const loginSchema = z.object({
  username: createTrimmedString(),
  password: createTrimmedString(),
  platform: z.string().nullable().optional(),
  operating_system: z.string().nullable().optional(),
  os_version: z.string().nullable().optional(),
  manufacturer: z.string().nullable().optional(),
  device_name: z.string().nullable().optional(),
  device_model: z.string().nullable().optional(),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),
  locality: z.string().nullable().optional(),
  area: z.string().nullable().optional(),
  postal_code: z.string().nullable().optional(),
})
