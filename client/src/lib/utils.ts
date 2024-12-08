import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { ZodSchema } from 'zod'
import { z } from 'zod'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const trim = (str: string | null | undefined): string => {
  return (str || '').trim()
}

export const transformEmptyStringToNull = (
  schema: ZodSchema<string | null | undefined> = z.string().nullable().optional()
) => schema.transform((val) => trim(val) || null)

export const transformTrimmedString = (schema: ZodSchema<string> = z.string()) => schema.transform((val) => trim(val))
