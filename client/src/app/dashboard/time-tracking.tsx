import { Clock10, LogIn, LogOut } from 'lucide-react'
import React, { useCallback } from 'react'
import type { z } from 'zod'

import type { activityLogCreateSchema } from '@/app/dashboard/schemas'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { getDeviceInfo } from '@/lib/device'
import type { LocationInfo } from '@/lib/geolocation'
import { formateLocationInfo, getAddressFromCoordinates, getCurrentLocation } from '@/lib/geolocation'
import { dateTimeNow } from '@/lib/timeUtils'
import api from '@/services/api'

const TimeTracking = () => {
  const getCurrentAddress = useCallback(async () => {
    const position = await getCurrentLocation()
    const address = await getAddressFromCoordinates(position?.coords?.latitude, position?.coords.longitude)
    if (address && position) {
      const formattedLocation: LocationInfo = formateLocationInfo({
        address,
        position,
      })

      return formattedLocation
    } else return {} as LocationInfo
  }, [])

  // const startLiveTracker = useCallback(async () => {
  //   const trackingId = await addLocationWatcher(async (location) => {
  //     if (location) {
  //       const address = await getAddressFromCoordinates(location?.latitude, location?.longitude)

  //       if (address && location) {
  //         const formattedLocation: LocationInfo = formateLocationInfo({
  //           address,
  //           location,
  //         })
  //         setPositions((prev) => [...prev, formattedLocation])
  //       }
  //     }
  //   })
  //   setTrackId(trackingId)
  // }, [])

  // Create a DateTime object in IST

  const handleClockedIn = async () => {
    const deviceInfo = await getDeviceInfo()

    const locationInfo = await getCurrentAddress()
    const bodyData: z.infer<typeof activityLogCreateSchema> = {
      ...locationInfo,
      ...deviceInfo,
      clock_in: dateTimeNow(),
      clock_out: null,
    }
    try {
      const res = await api.post('/clock-in', bodyData)
      console.log('res', res)
    } catch (error) {
      console.log('error', error)
    }
  }

  const handleClockedOut = async () => {
    const deviceInfo = await getDeviceInfo()

    const position = await getCurrentLocation()
    const address = await getAddressFromCoordinates(position?.coords?.latitude, position?.coords.longitude)
    const formattedLocation = formateLocationInfo({
      position,
      address,
    })
    const bodyData: z.infer<typeof activityLogCreateSchema> = {
      ...formattedLocation,
      ...deviceInfo,
      clock_out: dateTimeNow(),
    }
    try {
      const res = await api.post('/clock-out', bodyData)
      console.log('res', res)
    } catch (error) {
      console.log('error', error)
    }
    // if (trackId) {
    //   removeLocationWatcher(trackId)
    // }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="flex items-center gap-2">
            <Clock10 />
            Time Tracking
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center gap-4">
          <Button className="w-36" onClick={handleClockedIn}>
            <LogIn />
            Clock In
          </Button>
          <Button className="w-36" onClick={handleClockedOut}>
            <LogOut />
            Clock Out
          </Button>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-center">
        <div className="">
          <p className="font-semibold text-muted-foreground">Current status</p>
          <p className="font-semibold">Not Clocked In</p>
        </div>
      </CardFooter>
    </Card>
  )
}

export default TimeTracking
