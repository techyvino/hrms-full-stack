import { z } from 'zod'

export const punchClockSchema = z.object({
  clock_action: z.enum(['in', 'out']),
  clock_in: z.string().nullable().optional(),
  clock_out: z.string().nullable().optional(),
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

export type PunchClock = z.infer<typeof punchClockSchema>

export interface ClockEntry {
  id: number
  clock_in: string
  clock_out: string
  date: string
}

export interface ClockedStatusData {
  next_clock_action: 'in' | 'out'
  entries: ClockEntry[]
  clock_in_time: string
  clock_out_time: string
  istTimeStamp: string
  adjusted_clock_in_time: string
}
