'use client'

import dynamic from 'next/dynamic'
import type { FC, ReactNode } from 'react'

const NoSSRNode: FC<{
  children: ReactNode
}> = ({ children }) => <>{children}</>

export const NoSSRWrapper = dynamic(() => Promise.resolve(NoSSRNode), {
  ssr: false,
})
