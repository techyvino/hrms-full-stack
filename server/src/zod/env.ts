import { z } from 'zod'

import type { DB } from '@/db'

export const envSchema = z.object({
  DATABASE_URL: z.string(),
  ACCESS_TOKEN_SECRET: z.string(),
  MAXIMUM_LOGIN_ATTEMPTS: z.string().optional(),
  RESET_LOGIN_TIMEOUT: z.string().optional(),
  SALT: z.string(),
  ENV: z
    .union([
      z.literal('development'),
      z.literal('testing'),
      z.literal('production'),
    ])
    .default('development'),
})

export type AppEnvVariables = z.infer<typeof envSchema>

export type Variables = Record<string, unknown> & AppEnvVariables & { db: DB }
// eslint-disable-next-line n/no-process-env
export const envVariables = envSchema.parse(process.env || {})
