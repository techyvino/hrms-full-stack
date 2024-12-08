import { drizzle } from 'drizzle-orm/neon-http'

import envVariables from '@/env'

// eslint-disable-next-line unicorn/prevent-abbreviations
export const db = drizzle(envVariables.DATABASE_URL!)

export type DB = typeof db
