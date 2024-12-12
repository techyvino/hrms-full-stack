import 'zod-openapi/extend'

import { z } from 'zod'

import { HttpStatusCode } from '@/lib/http-status'
import { createTrimmedString } from '@/lib/utils'

export const responseSchema = z.object({
  message: z.string(),
  success: z.boolean(),
  status: z.nativeEnum(HttpStatusCode),
})

// Login - Request
export const loginRequestSchema = z.object({
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

// Login - Response
export const loginResponseSuccessSchema = responseSchema
  .extend({
    data: z.object({
      access_token: z.string(),
      user: z.object({
        name: z.string(),
        email: z.string(),
        user_id: z.number(),
        role_id: z.number(),
      }),
    }),
  })
  .omit({
    message: true,
  })

// Change Password - Request
export const changePasswordSchema = z.object({
  old_password: z.string({
    message: 'Old Password is required',
  }),
  new_password: z.string({
    message: 'New Password is required',
  }),
})

// Forgot Password - Request
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
