import type { NotFoundHandler } from 'hono'

import { getDefaultMessageForCode, HttpStatusCode } from '@/lib/http-status'

const notFound: NotFoundHandler = (c) => {
  return c.json(
    {
      message:
        getDefaultMessageForCode(HttpStatusCode.NOT_FOUND) + `- ${c.req.path}`,
    },
    HttpStatusCode.NOT_FOUND
  )
}

export default notFound
