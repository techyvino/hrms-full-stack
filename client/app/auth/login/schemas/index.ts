import { z } from 'zod'

import { transformTrimmedString } from '@/lib/utils'

export const loginSchema = z
  .object({
    username: transformTrimmedString(z.string().min(1, { message: 'Username is required' })),
    password: transformTrimmedString(z.string().min(1, { message: 'Password is required' })),
  })
  .passthrough()

export type LoginSchema = z.infer<typeof loginSchema>

export interface LoginResponse {
  message: string
  data: {
    access_token: string
  }
}
