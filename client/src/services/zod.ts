import { HttpStatusCode } from 'axios'
import { z } from 'zod'

export const responseSchema = z.object({
  message: z.string(),
  success: z.boolean(),
  status: z.nativeEnum(HttpStatusCode),
})
