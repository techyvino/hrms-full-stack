import 'zod-openapi/extend'

import { z } from 'zod'

import { HttpStatusCode } from '@/lib/http-status'

export const responseSchema = z.object({
  message: z.string(),
  success: z.boolean(),
  status: z.nativeEnum(HttpStatusCode),
})

// Login - Request
export const loginRequestSchema = z.object({
  username: z.string().min(1, { message: 'Username is required' }),
  password: z.string().min(1, { message: 'Password is required' }),
  device_info: z
    .object({
      platform: z.string().optional().nullable(),
      operating_system: z.string().optional().nullable(),
      os_version: z.string().optional().nullable(),
      manufacturer: z.string().optional().nullable(),
      device_name: z.string().optional().nullable(),
      device_model: z.string().optional().nullable(),
    })
    .passthrough()
    .nullable()
    .optional(),
  location_info: z
    .object({
      latitude: z.number().optional().nullable(),
      longitude: z.number().optional().nullable(),
      accuracy: z.number().optional().nullable(),
      timestamp: z.number().optional().nullable(),

      locality: z.string().optional().nullable(),
      area: z.string().optional().nullable(),
      postal_code: z.string().optional().nullable(),

      speed: z.number().optional().nullable(),
      altitude: z.number().optional().nullable(),
    })
    .passthrough()
    .nullable()
    .optional(),
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
