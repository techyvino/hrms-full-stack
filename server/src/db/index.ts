import { drizzle } from 'drizzle-orm/neon-http'

import envVariables from '@/env'

export const db = drizzle(envVariables.DATABASE_URL!)

export type DB = typeof db
