import type { NotFoundHandler } from 'hono'

const notFound: NotFoundHandler = (c) => {
  return c.json(
    {
      message: `${NOT_FOUND_MESSAGE} - ${c.req.path}`,
    },
    NOT_FOUND
  )
}

export default notFound
