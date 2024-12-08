import 'dotenv/config'

import { env } from 'node:process'

import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  out: './src/drizzle',
  schema: './src/db/schemas',
  dialect: 'postgresql',
  dbCredentials: {
    url: env?.DATABASE_URL || '',
  },
})
