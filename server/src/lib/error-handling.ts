import type { NeonDbError } from '@neondatabase/serverless'

import env from '@/env.js'

export const dbError = (error: NeonDbError) => {
  const errorMessages: Record<string, string> = {
    '23505':
      'This entry already exists. Please check your data for duplicates.',
    '23503':
      'The referenced entry does not exist. Please verify your foreign key references.',
    '42601':
      'There is a syntax error in your SQL query. Please review your query structure.',
    '28000':
      'Invalid authorization specification. Please check your username and password.',
    '3D000':
      'The database does not exist. Please ensure you are connecting to the correct database.',
    // Add more error codes and messages as needed
  }
  const isProduction = env.ENVIRONMENt === 'production'

  return {
    message: error?.code
      ? errorMessages[error.code]
      : 'An unknown error occurred.',
    ...(isProduction
      ? { severity: error?.severity, code: error?.code, detail: error?.detail }
      : { ...error }),
  }
}
