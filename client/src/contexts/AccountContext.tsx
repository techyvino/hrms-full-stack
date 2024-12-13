'use client'
import { getCookie } from 'cookies-next/client'
import { jwtDecode } from 'jwt-decode'
import { useEffect, useState } from 'react'

export interface User {
  name: string
  email: string
  user_id: number
  role_id: number
}

export const useAccount = () => {
  const [account, setAccount] = useState<User>({} as User)
  const token = getCookie('access_token')

  useEffect(() => {
    if (token) {
      const { id, email, name, role_id } = jwtDecode(token) as Omit<User, 'user_id'> & { id: number }
      if (id) {
        setAccount({ user_id: id, email, name, role_id })
      }
    }
  }, [token])

  return account
}
