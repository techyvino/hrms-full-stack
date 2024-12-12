'use client'
import { getCookie } from 'cookies-next/client'
import { jwtDecode } from 'jwt-decode'
import type { ReactNode } from 'react'
import React, { createContext, useContext, useEffect, useState } from 'react'

export interface User {
  name: string
  email: string
  user_id: number
  role_id: number
}

export const AccountContext = createContext<User>({} as User)

export const AccountContextProvider = ({ children }: { children: ReactNode }) => {
  const [account, setAccount] = useState<User>({} as User)
  const token = getCookie('access_token')

  useEffect(() => {
    if (token) {
      const { id, email, name, role_id } = jwtDecode(token) as Omit<User, 'user_id'> & { id: number }
      if (id) {
        setAccount({ user_id: id, email, name, role_id })
      }

      // setAccount(JSON.parse(account))
    }
  }, [token])

  return <AccountContext.Provider value={{ ...account }}>{children}</AccountContext.Provider>
}

export const useAccountContext = () => useContext(AccountContext)

export default AccountContext
