import crypto from 'node:crypto'

import type { ZodError } from 'zod'
import { z } from 'zod'

export function formatZodErrors(error: ZodError) {
  const { fieldErrors, formErrors } = error.flatten()
  return { ...fieldErrors, ...formErrors }
}

export const createTrimmedString = () =>
  z.string().transform((value) => (value || '').trim())

export const getRandomString = () => {
  const timestamp = Date.now().toString(36) // Base36 encoded timestamp
  const randomString = crypto.randomUUID().toString()
  return `${timestamp}-${randomString}`
}

export const istDateTimeNow = () => {
  const now = new Date()
  // Convert to IST
  const istOffset = 5.5 * 60 * 60 * 1000 // IST is UTC+5:30
  return new Date(now.getTime() + istOffset)
}

export const dateTimeNow = () => {
  return new Date()
}

export function extractKeys<
  T extends Record<string, unknown>,
  K extends keyof T,
>(data: T, keys?: K[]): Pick<T, K> {
  const result: Partial<T> = {}
  if (keys) {
    for (const key of keys) {
      if (key in data) {
        result[key] = data[key]
      }
    }
    return result as Pick<T, K>
  }
  return data
}
