import type { ReactNode } from 'react'
import React, { createContext, useContext, useEffect, useState } from 'react'

export const AccountContext = createContext(null)

export const AccountContextProvider = ({ children }: { children: ReactNode }) => {
  const [userInfo, setUserInfo] = useState<null>(null)

  useEffect(() => {
    const getDeviceInformation = async () => {
      setUserInfo(null)
    }
    getDeviceInformation() // get device information
  }, [])
  return <AccountContext.Provider value={null}>{children}</AccountContext.Provider>
}

export const useAccountContext = () => useContext(AccountContext)

export default AccountContext
