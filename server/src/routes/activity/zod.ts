import 'zod-openapi/extend'

import { z } from 'zod'

import { responseSchema } from '@/routes/auth/zod'

export const punchClockRequestSchema = z.object({
  user_id: z.number(),
  clock_action: z.enum(['in', 'out']),
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
  speed: z.number().nullable().optional(),
  accuracy: z.number().nullable().optional(),
  altitude: z.number().nullable().optional(),
  locality: z.string().nullable().optional(),
  area: z.string().nullable().optional(),
  postal_code: z.string().nullable().optional(),
  platform: z.string().nullable().optional(),
  operating_system: z.string().nullable().optional(),
  os_version: z.string().nullable().optional(),
  manufacturer: z.string().nullable().optional(),
  device_name: z.string().nullable().optional(),
  device_model: z.string().nullable().optional(),
})

export const clockedInStatusResponseSchema = responseSchema
  .omit({ message: true })
  .extend({
    data: z.object({
      is_clocked_in: z.boolean(),
      clocked_in_at: z.string().nullable(),
      clocked_out_at: z.string().nullable(),
    }),
  })

export const punchInfoResponseSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  clock_in: z.string(),
  clock_out: z.null(),
  clock_in_location: z.object({
    area: z.string(),
    speed: z.null(),
    memUsed: z.number(),
    accuracy: z.number(),
    altitude: z.number(),
    diskFree: z.number(),
    latitude: z.number(),
    locality: z.string(),
    diskTotal: z.number(),
    isVirtual: z.boolean(),
    longitude: z.number(),
    timestamp: z.number(),
    postal_code: z.string(),
    realDiskFree: z.number(),
    realDiskTotal: z.number(),
    webViewVersion: z.string(),
    androidSDKVersion: z.number(),
  }),
  clock_out_location: z.null(),
  clock_in_device: z.object({
    platform: z.string(),
    os_version: z.string(),
    device_name: z.string(),
    device_model: z.string(),
    manufacturer: z.string(),
    operating_system: z.string(),
  }),
  clock_out_device: z.null(),
})
