import { z } from 'zod'

import type { User } from '@/contexts/AccountContext'
import { transformTrimmedString } from '@/lib/utils'

export const loginSchema = z.object({
  username: transformTrimmedString(z.string().min(1, { message: 'Username is required' })),
  password: transformTrimmedString(z.string().min(1, { message: 'Password is required' })),
  platform: z.string().optional().nullable(),
  operating_system: z.string().optional().nullable(),
  os_version: z.string().optional().nullable(),
  manufacturer: z.string().optional().nullable(),
  device_name: z.string().optional().nullable(),
  device_model: z.string().optional().nullable(),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),
  locality: z.string().optional().nullable(),
  area: z.string().optional().nullable(),
  postal_code: z.string().optional().nullable(),
})

export type LoginSchema = z.infer<typeof loginSchema>

export interface LoginResponse {
  message: string
  data: {
    access_token: string
    user: User
  }
}
