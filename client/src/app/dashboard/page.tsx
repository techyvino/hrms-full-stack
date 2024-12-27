'use client'
import { Card, CardBody } from '@nextui-org/react'
import { Coffee, Laptop } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

import { TimeHistory } from '@/app/dashboard/components/time-history'
import TimeTracking from '@/app/dashboard/components/time-tracking'
import type { ClockedStatusData } from '@/app/dashboard/schemas'
import { AttendanceIcon, LeaveIcon } from '@/components/icons'
import { useAccount } from '@/hooks/useAccount'
import { useFetch } from '@/hooks/useFetch'
import { useSubmit } from '@/hooks/useSubmit'
import { getDeviceInfo } from '@/lib/device'
import { getCurrentAddress } from '@/lib/geolocation'
import { calculateWorkAndBreakTime } from '@/lib/timeUtils'
import { activityUrl } from '@/lib/urls'

export default function Home() {
  const { data, isLoading, fetcher } = useFetch<ClockedStatusData>()
  const { user_id } = useAccount()
  const { push } = useRouter()

  const {
    submit,
    isLoading: isSubmitting,
    startLoader,
    stopLoader,
  } = useSubmit({
    onSuccess: () => {
      fetcher(activityUrl?.clockedStatus)
    },
  })

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
    startLoader()
    const deviceInfo = await getDeviceInfo()
    const locationInfo = await getCurrentAddress()

    if (!locationInfo) return stopLoader()

    const bodyData = {
      ...locationInfo,
      ...deviceInfo,
      user_id,
      clock_action: data?.next_clock_action,
    }

    return submit({
      url: activityUrl.punchClock,
      data: bodyData,
    })
  }

  const { totalBreakTime, totalWorkTime } = calculateWorkAndBreakTime(data?.entries || [])

  useEffect(() => {
    fetcher(activityUrl.clockedStatus)
  }, [fetcher])

  return (
    <main>
      <div className="m-5 flex justify-between gap-5">
        <Card isPressable className="flex h-20 w-1/2 items-center justify-center" onPress={() => push('/attendance')}>
          <CardBody className="flex items-center gap-2 font-bold">
            <AttendanceIcon />
            View Attendance
          </CardBody>
        </Card>
        <Card isPressable className="flex h-20 w-1/2 items-center justify-center" onPress={() => push('/admin')}>
          <CardBody className="flex items-center gap-2 font-bold">
            <LeaveIcon size={90} />
            Request Time Off
          </CardBody>
        </Card>
      </div>
      <div className="m-5 flex justify-between gap-5">
        <Card className="flex h-20 w-1/2 items-center justify-center">
          <CardBody className="flex items-center gap-2 font-bold">
            <div className="flex gap-2">
              <Laptop className="stroke-sky-600 " />
              Work Time
            </div>
            <div className="">{totalWorkTime}</div>
          </CardBody>
        </Card>
        <Card className="justify- flex h-20 w-1/2 items-center">
          <CardBody className="flex items-center gap-2 font-bold">
            <div className="flex gap-2">
              <Coffee className="stroke-red-950" />
              Break Time
            </div>
            <div className="">{totalBreakTime}</div>
          </CardBody>
        </Card>
      </div>
      <div className="mx-5 space-y-5">
        <TimeTracking
          data={data}
          handlePunchClock={handlePunchClock}
          isLoading={isLoading}
          isSubmitting={isSubmitting}
        />
        <TimeHistory entries={data?.entries || []} />
      </div>
    </main>
  )
}
