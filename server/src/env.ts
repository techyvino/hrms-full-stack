import { config } from 'dotenv'
import { expand } from 'dotenv-expand'
import { z } from 'zod'

expand(config())

const EnvironmentSchema = z.object({
  ENVIRONMENt: z
    .enum(['development', 'testing', 'production'])
    .default('development'),
  PORT: z.coerce.number().default(8080),
  LOG_LEVEL: z
    .enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'])
    .optional()
    .default('info'),
  DATABASE_URL: z.string(),
  ACCESS_TOKEN_SECRET: z.string(),
  MAXIMUM_LOGIN_ATTEMPTS: z.string().optional(),
  RESET_LOGIN_TIMEOUT: z.string().optional(),
  SALT: z.string(),
})

export type env = z.infer<typeof EnvironmentSchema>

// eslint-disable-next-line n/no-process-env
const { data: envVariables, error } = EnvironmentSchema.safeParse(process.env)

if (error) {
  console.error('❌ Invalid env:')
  console.error(JSON.stringify(error.flatten().fieldErrors, null, 2))
  // eslint-disable-next-line unicorn/no-process-exit
  process.exit(1)
}
export default envVariables!
