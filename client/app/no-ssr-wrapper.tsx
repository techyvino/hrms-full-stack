'use client'

import dynamic from 'next/dynamic'
import type { FC, ReactNode } from 'react'

const NoSSRWrapper: FC<{
  children: ReactNode
}> = ({ children }) => <>{children}</>

export default dynamic(() => Promise.resolve(NoSSRWrapper), {
  ssr: false,
})
