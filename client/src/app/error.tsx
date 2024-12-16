'use client'

import { Button } from '@nextui-org/react'
import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: Readonly<{
  error: Error & { digest?: string }
  reset: () => void
}>) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error?.message)
  }, [error])

  return (
    <div className="flex flex-col h-[85vh] justify-center items-center">
      <h1 className="text-7xl font-bold my-5">Oops!</h1>
      <p className="text-danger font-semibold">{error?.message ?? 'Something went wrong'}</p>
      <Button variant="shadow" className="mt-10" onPress={reset}>
        Try Again
      </Button>
    </div>
  )
}
