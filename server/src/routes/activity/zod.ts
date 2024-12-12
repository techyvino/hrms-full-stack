import 'zod-openapi/extend'

import { z } from 'zod'

import { responseSchema } from '@/routes/auth/zod'

export const clockedInStatusResponseSchema = responseSchema
  .omit({ message: true })
  .extend({
    data: z.object({
      is_clocked_in: z.boolean(),
      clocked_in_at: z.string().nullable(),
      clocked_out_at: z.string().nullable(),
    }),
  })
