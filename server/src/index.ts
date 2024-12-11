import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { prettyJSON } from 'hono/pretty-json'

import envVariables from '@/env'
import { respondHandler } from '@/lib/http-status'
import { authMiddleware } from '@/middleware/auth-middleware'
import notFound from '@/middleware/not-found'
import serveEmojiFavicon from '@/middleware/serve-emoji-favicon'
import activityRouter from '@/routes/activity'
import authRouter from '@/routes/auth'
import lookupRouter from '@/routes/lookups'
import userRouter from '@/routes/user'

const app = new Hono().basePath('/api')

app.notFound(notFound) // custom 404 response

app.use(serveEmojiFavicon('🔥'))

app.get('/', (c) => {
  return respondHandler(c, 'success', 'hello hono!')
})

app.use(prettyJSON())

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
})
