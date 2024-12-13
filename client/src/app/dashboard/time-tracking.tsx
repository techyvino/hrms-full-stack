import { formatDistanceToNow } from 'date-fns'
import { Clock4, Clock10, LogIn } from 'lucide-react'
import React, { useCallback, useEffect } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useFetch } from '@/hooks/useFetch'
import { useSubmit } from '@/hooks/useSubmit'
import { getDeviceInfo } from '@/lib/device'
import type { LocationInfo } from '@/lib/geolocation'
import { formateLocationInfo, getAddressFromCoordinates, getCurrentLocation } from '@/lib/geolocation'
import { dateTimeNow } from '@/lib/timeUtils'
import { activityUrl } from '@/lib/urls'
import { cn } from '@/lib/utils'

interface ClockedStatus {
  status: number
  success: boolean
  data: {
    next_clock_action: 'in' | 'out'
    entries: unknown[]
    clock_in_time: string
    clock_out_time: string
    istTimeStamp: string
    adjusted_clock_in_time: string
  }
}

const TimeTracking = () => {
  const { response, isLoading, fetcher } = useFetch<ClockedStatus>()

  const { submit, isLoading: isSubmitting } = useSubmit({
    onSuccess: (res) => {
      console.log('res:', res)
      fetcher(activityUrl?.clockedStatus)
    },
  })

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

  const handlePunchClock = async () => {
    const deviceInfo = await getDeviceInfo()

    // const locationInfo = await getCurrentAddress()
    const bodyData = {
      // ...locationInfo,
      ...deviceInfo,
      clock_action: response?.data?.next_clock_action,
      clock_in: dateTimeNow(),
      clock_out: null,
    }
    submit({
      url: activityUrl.punchClock,
      data: bodyData,
    })
  }

  const isActive = response?.data?.clock_in_time

  const distanceInMins =
    response?.data?.clock_in_time &&
    formatDistanceToNow(response?.data?.clock_in_time, {
      addSuffix: true,
      includeSeconds: true,
    })

  useEffect(() => {
    fetcher(activityUrl.clockedStatus)
  }, [fetcher])

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-lg">
              <Clock10 />
              Time Tracking
            </div>
            <Badge variant="secondary" className={cn('w-fit rounded-full', isActive ? 'bg-green-400' : 'bg-red-400')}>
              <Clock4 className="mr-2 size-4" />
              <p className={cn('text-md')}>{isActive ? 'Active' : 'Inactive'}</p>
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mt-6 flex justify-center gap-4">
          <Button isLoading={isSubmitting} className="w-36" onClick={handlePunchClock}>
            <LogIn />
            {response?.data?.next_clock_action === 'in' ? 'Clock In' : 'Clock Out'}
          </Button>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-center">
        <div className="">
          {isLoading ? (
            <Skeleton className="h-8 w-28" />
          ) : (
            <div className="flex items-center justify-center">
              {isActive && (
                <div>
                  <div className="text-center text-lg font-semibold">Clocked in for</div>
                  <div className="flex items-center">{`${distanceInMins}`}</div>
                </div>
              )}
            </div>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}

export default TimeTracking
