import { formatDistanceToNow } from 'date-fns'
import { Clock4, Clock10, LogIn, LogOut } from 'lucide-react'
import React, { useCallback, useEffect } from 'react'
import type { z } from 'zod'

import type { activityLogCreateSchema } from '@/app/dashboard/schemas'
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
    is_clocked_in: boolean
    clocked_in_at: string | null
    clocked_out_at: string | null
  }
}

const TimeTracking = () => {
  const { data, isLoading, fetcher } = useFetch<ClockedStatus>()

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

  const handleClockedIn = async () => {
    const deviceInfo = await getDeviceInfo()

    const locationInfo = await getCurrentAddress()
    const bodyData: z.infer<typeof activityLogCreateSchema> = {
      ...locationInfo,
      ...deviceInfo,
      clock_in: dateTimeNow(),
      clock_out: null,
    }
    submit({
      url: activityUrl.clockedIn,
      data: bodyData,
    })
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
    submit({
      url: activityUrl.clockedOut,
      data: bodyData,
    })
  }

  const isActive = data?.data?.is_clocked_in

  const distanceInMins =
    data?.data?.clocked_in_at &&
    formatDistanceToNow(data?.data?.clocked_in_at, {
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
          <Button
            isLoading={isSubmitting}
            disabled={data?.data?.is_clocked_in}
            className="w-36"
            onClick={handleClockedIn}
          >
            <LogIn />
            Clock In
          </Button>
          <Button
            isLoading={isSubmitting}
            disabled={!data?.data?.is_clocked_in}
            className="w-36"
            onClick={handleClockedOut}
          >
            <LogOut />
            Clock Out
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
