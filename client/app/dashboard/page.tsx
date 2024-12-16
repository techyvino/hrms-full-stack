'use client'

import { Card, CardBody } from '@nextui-org/react'
import { CalendarCheck, CalendarX2 } from 'lucide-react'
import { useCallback, useEffect } from 'react'

import { TimeHistory } from '@/app/dashboard/components/time-history'
import TimeTracking from '@/app/dashboard/components/time-tracking'
import type { ClockedStatus } from '@/app/dashboard/schemas'
import { useAccount } from '@/hooks/useAccount'
import { useFetch } from '@/hooks/useFetch'
import { useSubmit } from '@/hooks/useSubmit'
import { getDeviceInfo } from '@/lib/device'
import {
  formateLocationInfo,
  getAddressFromCoordinates,
  getCurrentLocation,
  type LocationInfo,
} from '@/lib/geolocation'
import { activityUrl } from '@/lib/urls'

export default function Home() {
  const { response, isLoading, fetcher } = useFetch<ClockedStatus>()
  const { user_id } = useAccount()

  const { submit, isLoading: isSubmitting } = useSubmit({
    onSuccess: () => {
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
      user_id,
      clock_action: response?.data?.next_clock_action,
    }
    submit({
      url: activityUrl.punchClock,
      data: bodyData,
    })
  }

  useEffect(() => {
    fetcher(activityUrl.clockedStatus)
  }, [fetcher])

  return (
    <main>
      <div className="m-5 flex justify-between gap-5">
        <Card className="flex h-20 w-1/2 items-center justify-center">
          <CardBody className="flex items-center gap-2 font-bold">
            <CalendarCheck />
            View Attendance
          </CardBody>
        </Card>
        <Card className="flex h-20 w-1/2 items-center justify-center">
          <CardBody className="flex items-center gap-2 font-bold">
            <CalendarX2 />
            Request Time Off
          </CardBody>
        </Card>
      </div>
      <div className="mx-5 space-y-5">
        <TimeTracking
          handlePunchClock={handlePunchClock}
          data={response?.data}
          isLoading={isLoading}
          isSubmitting={isSubmitting}
        />
        <TimeHistory entries={response?.data?.entries || []} />
      </div>
    </main>
  )
}
