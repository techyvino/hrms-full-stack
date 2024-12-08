'use client'
import type { ReactNode } from 'react'
import React, { useEffect } from 'react'

import { checkLocationPermission, reqLocationPermission } from '@/lib/geolocation'
import { checkNotificationPermission, getNotificationPermission } from '@/lib/notification'

const Layout = ({ children }: { children: ReactNode }) => {
  const getPermissions = async () => {
    const NotifyPermissionStatus = await checkNotificationPermission()
    const LocationPermissionStatus = await checkLocationPermission()

    if (NotifyPermissionStatus !== 'granted') {
      getNotificationPermission()
    }
    if (LocationPermissionStatus !== 'granted') {
      reqLocationPermission()
    }
  }
  useEffect(() => {
    getPermissions()
  }, [])

  return (
    <div className="flex h-screen flex-col justify-between">
      <h6 className="float-start p-3 font-semibold">hrms</h6>
      {children}
      <svg
        id="wave"
        style={{ transform: 'rotate(0deg)', transition: '0.3s' }}
        viewBox="0 0 1440 330"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        className="fixed bottom-0 md:-bottom-36"
      >
        <defs>
          <linearGradient id="sw-gradient-0" x1={0} x2={0} y1={1} y2={0}>
            <stop stopColor="rgba(233, 249, 255, 1)" offset="0%" />
            <stop stopColor="rgba(157.733, 228.473, 255, 1)" offset="100%" />
          </linearGradient>
        </defs>
        <path
          style={{ transform: 'translate(0, 0px)', opacity: 1 }}
          fill="url(#sw-gradient-0)"
          d="M0,0L80,0C160,0,320,0,480,49.5C640,99,800,198,960,203.5C1120,209,1280,121,1440,88C1600,55,1760,77,1920,110C2080,143,2240,187,2400,187C2560,187,2720,143,2880,115.5C3040,88,3200,77,3360,110C3520,143,3680,220,3840,231C4000,242,4160,187,4320,181.5C4480,176,4640,220,4800,225.5C4960,231,5120,198,5280,176C5440,154,5600,143,5760,126.5C5920,110,6080,88,6240,99C6400,110,6560,154,6720,165C6880,176,7040,154,7200,159.5C7360,165,7520,198,7680,220C7840,242,8000,253,8160,253C8320,253,8480,242,8640,198C8800,154,8960,77,9120,38.5C9280,0,9440,0,9600,16.5C9760,33,9920,66,10080,82.5C10240,99,10400,99,10560,121C10720,143,10880,187,11040,176C11200,165,11360,99,11440,66L11520,33L11520,330L11440,330C11360,330,11200,330,11040,330C10880,330,10720,330,10560,330C10400,330,10240,330,10080,330C9920,330,9760,330,9600,330C9440,330,9280,330,9120,330C8960,330,8800,330,8640,330C8480,330,8320,330,8160,330C8000,330,7840,330,7680,330C7520,330,7360,330,7200,330C7040,330,6880,330,6720,330C6560,330,6400,330,6240,330C6080,330,5920,330,5760,330C5600,330,5440,330,5280,330C5120,330,4960,330,4800,330C4640,330,4480,330,4320,330C4160,330,4000,330,3840,330C3680,330,3520,330,3360,330C3200,330,3040,330,2880,330C2720,330,2560,330,2400,330C2240,330,2080,330,1920,330C1760,330,1600,330,1440,330C1280,330,1120,330,960,330C800,330,640,330,480,330C320,330,160,330,80,330L0,330Z"
        />
      </svg>
    </div>
  )
}

export default Layout
