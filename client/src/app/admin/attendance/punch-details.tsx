'use client'
import { Card, CardBody, CardHeader, useDisclosure } from '@nextui-org/react'
import { Clock10, MoreVertical } from 'lucide-react'
import React from 'react'
import { Drawer } from 'vaul'

import InfoCard from '@/app/admin/attendance/components/detail-card'
import type { PunchDeviceInfo, PunchInfoResponse, PunchLocation } from '@/app/admin/schema'
import type { PunchInfo } from '@/app/attendance/page'
import { useFetch } from '@/hooks/useFetch'
import { durationByMinutes, formatDate } from '@/lib/timeUtils'
import { activityUrl } from '@/lib/urls'
import { cn } from '@/lib/utils'

interface PunchInfoProps {
  selectedDate: Date
  selectedPunchInfo?: PunchInfo
}

const PunchInfo = ({ selectedDate, selectedPunchInfo }: PunchInfoProps) => {
  const { isOpen, onOpenChange } = useDisclosure()
  const isWeekend = selectedDate.getDay() === 0

  const { isLoading, fetcher, data } = useFetch<PunchInfoResponse>()

  const getPunchDetailsById = async (id: number) => {
    return fetcher({
      url: activityUrl.punchInfo(id),
      method: 'GET',
    })
  }

  const locationFields = (address: PunchLocation) => [
    {
      name: 'Area',
      value: address?.area,
    },
    {
      name: 'City',
      value: address?.locality,
    },
    {
      name: 'Postal Code',
      value: address?.postal_code,
    },
    {
      name: 'Longitude',
      value: address?.longitude,
    },
    {
      name: 'Latitude',
      value: address?.latitude,
    },
  ]

  const deviceInfoFields = (device: PunchDeviceInfo) => [
    {
      name: 'Device Name',
      value: device?.device_name,
    },
    {
      name: 'Device Model',
      value: device?.device_model,
    },
    {
      name: 'Manufacturer',
      value: device?.manufacturer,
    },
    {
      name: 'Operating System',
      value: device?.operating_system,
    },
    {
      name: 'OS Version',
      value: device?.os_version,
    },
  ]

  const isDiffDevice = data?.clock_in_device?.device_name !== data?.clock_out_device?.device_name

  return (
    <Card fullWidth className="max-w-sm md:min-h-full md:max-w-2xl">
      <CardHeader className="border-b px-6 py-4">
        <div className="flex w-full items-center justify-between font-semibold">
          <div className="flex items-center gap-2">
            <p>{selectedDate && formatDate(selectedDate)}</p>
          </div>
          {selectedPunchInfo && (
            <div className="flex items-center gap-2">
              <p>
                {selectedPunchInfo?.totalDurationInMinutes &&
                  durationByMinutes(selectedPunchInfo?.totalDurationInMinutes, 'h', 'm', 0)}
              </p>
            </div>
          )}
        </div>
      </CardHeader>
      <CardBody>
        {selectedPunchInfo ? (
          selectedPunchInfo?.entries.map((entry) => (
            <Drawer.Root key={entry?.id} open={isOpen} onOpenChange={onOpenChange}>
              <Drawer.Trigger onClick={() => getPunchDetailsById(entry?.id)}>
                <div className="flex items-center justify-between border-b last:border-b-0">
                  <div className="my-4 flex items-center gap-2">
                    <Clock10 className="size-4" />
                    <p>{entry?.clockIn ? formatDate(entry?.clockIn, 'HH:mm') : 'NA'}</p>
                    <span>{'-'}</span>
                    <p>{entry?.clockOut ? formatDate(entry?.clockOut, 'HH:mm') : 'NA'}</p>
                  </div>
                  <div className="flex items-center">
                    <p>
                      {entry?.clockIn && entry?.clockOut
                        ? durationByMinutes(entry?.durationInMinutes)
                        : 'Missing Clocked-out'}
                    </p>
                    <MoreVertical className="size-4" />
                  </div>
                </div>
              </Drawer.Trigger>
              <Drawer.Portal>
                <Drawer.Overlay className="fixed inset-0 z-40 bg-black/10 dark:bg-gray-600/10" />
                <Drawer.Content className="fixed inset-x-0 bottom-0 z-50 mt-24 flex h-fit flex-col rounded-t-[10px] bg-gray-100 outline-none">
                  <div className="flex-1 rounded-t-md bg-background p-4">
                    <Drawer.Handle className="mb-4" />
                    <Drawer.Title />
                    <Drawer.Description />
                    <div className="">
                      {data?.clock_in && (
                        <h3 className="text-xl">
                          <span className="font-semibold">Date:</span>{' '}
                          <span>{data?.clock_in ? formatDate(data?.clock_in) : null}</span>
                        </h3>
                      )}
                      {/* Location Info */}
                      <div className="grid w-full grid-cols-2 gap-2">
                        <InfoCard
                          fields={locationFields(data?.clock_in_location)}
                          time={data?.clock_in}
                          title="Clock in at: "
                        />
                        <InfoCard
                          fields={locationFields(data?.clock_out_location)}
                          time={data?.clock_in}
                          title="Clock out at: "
                        />
                      </div>

                      {/* Device Info */}
                      <div className={cn('flex gap-2')}>
                        {data?.clock_in_device && isDiffDevice && (
                          <InfoCard fields={deviceInfoFields(data?.clock_in_device)} title="Device Info" />
                        )}
                        {data?.clock_out_device && (
                          <InfoCard fields={deviceInfoFields(data?.clock_out_device)} title="Device Info" />
                        )}
                      </div>
                    </div>
                  </div>
                </Drawer.Content>
              </Drawer.Portal>
            </Drawer.Root>
          ))
        ) : (
          <div className="w-full">{isWeekend ? 'Non working day!' : 'No History Found!'}</div>
        )}
      </CardBody>
    </Card>
  )
}

export default PunchInfo
