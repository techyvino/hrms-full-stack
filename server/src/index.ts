import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { prettyJSON } from 'hono/pretty-json'
import { describeRoute, openAPISpecs } from 'hono-openapi'

import envVariables from '@/env'
import { respondHandler } from '@/lib/http-status'
import notFound from '@/lib/not-found'
import serveEmojiFavicon from '@/lib/serve-emoji-favicon'
import { authMiddleware } from '@/middleware/auth-middleware'
import { pinoLogger } from '@/middleware/logger'
import activityRouter from '@/routes/activity'
import authRouter from '@/routes/auth'
import lookupRouter from '@/routes/lookups'
import userRouter from '@/routes/user'
import { apiReference } from '@scalar/hono-api-reference'
import { swaggerUI } from '@hono/swagger-ui'
import createApp from '@/lib/create-app'

const app = createApp().basePath('/api')

app.use('*', authMiddleware)

app.route('/auth', authRouter)
app.route('/user', userRouter)
app.route('/activity', activityRouter)
app.route('/lookups', lookupRouter)

const port = envVariables.PORT || 8000
console.info(`Server is running on http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port,
  hostname: '0.0.0.0',
})
