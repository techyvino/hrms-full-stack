import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { notFound } from 'stoker/middlewares'

const app = new Hono()

app.notFound(notFound) // custom 404 response

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

const port = 3000
console.info(`Server is running on http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port,
})
