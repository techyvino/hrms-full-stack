import { pinoLogger as logger } from 'hono-pino'
import pino from 'pino'
import pretty from 'pino-pretty'

import env from '@/env'
import { getRandomString } from '@/lib/utils'

export function pinoLogger() {
  return logger({
    pino: pino(
      {
        // level: env.LOG_LEVEL || 'silent',
        level: 'silent',
      },
      env.NODE_ENV === 'production' ? undefined : pretty()
    ),
    http: {
      reqId: () => getRandomString(),
    },
  })
}
