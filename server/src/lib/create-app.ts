import notFound from '@/lib/not-found'
import serveEmojiFavicon from '@/lib/serve-emoji-favicon'
import { pinoLogger } from '@/middleware/logger'
import { swaggerUI } from '@hono/swagger-ui'
import { apiReference } from '@scalar/hono-api-reference'
import { Hono } from 'hono'
import { openAPISpecs } from 'hono-openapi'
import { prettyJSON } from 'hono/pretty-json'

export default function createApp() {
  const app = new Hono()
  app.use(serveEmojiFavicon('🔥'))
  app.use(pinoLogger())
  app.use(prettyJSON())
  app.notFound(notFound)

  // Documentation: https://hono.dev/examples/hono-openapi
  app.get(
    '/openapi',
    openAPISpecs(app, {
      documentation: {
        info: {
          title: 'Hono',
          version: '1.0.0',
          description: 'API for greeting users',
        },
      },
    })
  )

  // API Documentation : Scalar for Hono
  app.get(
    '/docs',
    apiReference({
      theme: 'saturn',
      spec: {
        url: '/openapi',
      },
      defaultHttpClient: {
        targetKey: 'node',
        clientKey: 'axios',
      },
    })
  )

  // API Documentation : SwaggerUI for Hono
  app.get('/ui', swaggerUI({ url: '/openapi' }))

  return app
}
