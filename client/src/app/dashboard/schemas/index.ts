import { z } from 'zod'

export const activityLogCreateSchema = z.object({
  clock_in: z.string().nullable().optional(),
  clock_out: z.string().nullable().optional(),
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
  speed: z.number().nullable(),
  accuracy: z.number().nullable(),
  altitude: z.number().nullable(),
  locality: z.string().nullable(),
  area: z.string().nullable(),
  postal_code: z.string().nullable(),
  platform: z.string().nullable(),
  operating_system: z.string().nullable(),
  os_version: z.string().nullable(),
  manufacturer: z.string().nullable(),
  device_name: z.string().nullable().optional(),
  device_model: z.string().nullable(),
})
