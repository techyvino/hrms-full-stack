'use client'
import { getCookie } from 'cookies-next/client'
import { jwtDecode } from 'jwt-decode'
import { useEffect, useState } from 'react'

export interface JWTPayload {
  name: string
  email: string
  user_id: number
  role_id: number
}

export const useAccount = () => {
  const [account, setAccount] = useState<JWTPayload>({} as JWTPayload)
  const token = getCookie('access_token')

  useEffect(() => {
    if (token) {
      const { id, email, name, role_id } = jwtDecode(token) as Omit<JWTPayload, 'user_id'> & { id: number }

      if (id) {
        setAccount({ user_id: id, email, name, role_id })
      }
    }
  }, [token])

  return account
}
