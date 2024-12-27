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
type TableColumnKey<T> = keyof T
export function extractTableColumns<T>(
  table: T,
  columns: TableColumnKey<T>[]
): Pick<T, TableColumnKey<T>> {
  return columns?.reduce(
    (acc, column) => {
      acc[column] = table[column]
      return acc
    },
    {} as Pick<T, TableColumnKey<T>>
  )
}
