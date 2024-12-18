import envVariables from '@/env'
import createApp from '@/lib/create-app'
import activityRouter from '@/routes/activity'
import authRouter from '@/routes/auth'
import lookupRouter from '@/routes/lookups'
import userRouter from '@/routes/user'

const app = createApp().basePath('/api')

// app.use('*', authMiddleware)

app.route('/auth', authRouter)
app.route('/', userRouter)
app.route('/', activityRouter)
app.route('/', lookupRouter)

export default {
  port: envVariables.PORT || 8000,
  fetch: app.fetch,
}
