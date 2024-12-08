import crypto from 'node:crypto'

import type { ZodError } from 'zod'
import { z } from 'zod'

export function formatZodErrors(error: ZodError): { [x: string]: string }[] {
  return error.errors.map((error_) => ({
    [error_.path[0]]: `${error_.message.toLowerCase()}`, // Error message
  }))
}

export const createTrimmedString = () =>
  z.string().transform((value) => (value || '').trim())

export const getRandomString = () => {
  const timestamp = Date.now().toString(36) // Base36 encoded timestamp
  const randomString = crypto.randomUUID().toString()
  return `${timestamp}-${randomString}`
}
