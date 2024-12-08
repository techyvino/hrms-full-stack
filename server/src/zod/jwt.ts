import { z } from "zod"

export const jwtPayloadSchema = z.object({
  sub: z.string(),
  role: z.string(),
  session_id: z.string(),
  exp: z.number().refine((val) => val > Date.now() / 1000, {
    message: "expired",
  }),
  iat: z.number(),
})

export type JwtPayload = z.infer<typeof jwtPayloadSchema>
