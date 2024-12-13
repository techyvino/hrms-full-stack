import type { PinoLogger } from 'hono-pino'

import type { JWTPayloadWithUser } from '@/lib/auth'

export interface AppBindings {
  Variables: {
    logger: PinoLogger
    user: JWTPayloadWithUser
  }
}