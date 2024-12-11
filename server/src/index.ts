import envVariables from '@/env'
import createApp from '@/lib/create-app'
import { authMiddleware } from '@/middleware/auth-middleware'
import activityRouter from '@/routes/activity'
import authRouter from '@/routes/auth'
import lookupRouter from '@/routes/lookups'
import userRouter from '@/routes/user'

const app = createApp().basePath('/api')

app.use('*', authMiddleware)

app.route('/auth', authRouter)
app.route('/user', userRouter)
app.route('/activity', activityRouter)
app.route('/lookups', lookupRouter)

export default {
  port: envVariables.PORT || 8000,
  fetch: app.fetch,
}
