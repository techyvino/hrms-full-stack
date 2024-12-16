/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Hook } from '@hono/zod-validator'
import type { Env, ValidationTargets } from 'hono'
import { validator } from 'hono-openapi/zod'
import type { ZodType, ZodTypeDef } from 'zod'

import { formatZodErrors } from '@/lib/utils'

export const zodValidator = (
  target: keyof ValidationTargets,
  schema: ZodType<any, ZodTypeDef, any>,
  hook:
    | Hook<ZodType<any, ZodTypeDef, any>, Env, string, keyof ValidationTargets>
    | undefined = (result, c) => {
    if (!result.success) {
      return c.json(formatZodErrors(result?.error), 400)
    }
  }
) => validator(target, schema, hook)
