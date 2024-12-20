'use client'
import { getCookie } from 'cookies-next/client'
import { redirect, usePathname } from 'next/navigation'
import type { FC, ReactNode } from 'react'
import React, { useEffect } from 'react'

type WrapperComponent = FC<{ children: ReactNode }>

export const AuthWrapper: WrapperComponent = ({ children }) => {
  const token = getCookie('access_token')
  const path = usePathname()

  useEffect(() => {
    if (!token && path !== '/auth/login') {
      redirect('/auth/login')
    }
    if (token && path === '/') {
      redirect('/dashboard')
    }
  }, [path, token])

  return <div>{children}</div>
}
