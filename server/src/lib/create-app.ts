import { swaggerUI } from '@hono/swagger-ui'
import { apiReference } from '@scalar/hono-api-reference'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { prettyJSON } from 'hono/pretty-json'
import { openAPISpecs } from 'hono-openapi'

import notFound from '@/lib/not-found'
import serveEmojiFavicon from '@/lib/serve-emoji-favicon'
import type { AppBindings } from '@/lib/types'
import { pinoLogger } from '@/middleware/logger'
export const createRouter = () => {
  return new Hono<AppBindings>({
    strict: false,
  })
}

export default function createApp() {
  const app = createRouter()
  app.use(serveEmojiFavicon('🔥'))

  app.use(pinoLogger())
  app.use(prettyJSON())
  app.notFound(notFound)
  app.use(cors())

  // Documentation: https://hono.dev/examples/hono-openapi
  app.get(
    '/openapi',
    openAPISpecs(app, {
      documentation: {
        info: {
          title: 'HRMS - API Documentation',
          version: '1.0.0',
          description: 'API Documentation for each endpoint',
        },
        components: {
          securitySchemes: {
            bearerAuth: {
              type: 'http',
              scheme: 'bearer',
              bearerFormat: 'JWT',
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
    })
  )

  // API Documentation : Scalar for Hono
  app.get(
    '/docs',
    apiReference({
      theme: 'saturn',
      _integration: 'nextjs',
      layout: 'modern',
      pageTitle: 'HRMS - API Reference',
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
