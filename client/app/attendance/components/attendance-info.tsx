'use client'
import { Button, Card, CardBody, CardHeader, useDisclosure } from '@nextui-org/react'
import { Clock10, MoreVertical } from 'lucide-react'
import React from 'react'
import { Drawer } from 'vaul'

import type { PunchInfo } from '@/app/attendance/page'
import { durationByMinutes, formatDate } from '@/lib/timeUtils'
import { cn } from '@/lib/utils'

interface AttendanceInfoProps {
  selectedDate: Date
  selectedPunchInfo?: PunchInfo
}

const AttendanceInfo = ({ selectedDate, selectedPunchInfo }: AttendanceInfoProps) => {
  const { isOpen, onOpenChange } = useDisclosure()
  const isWeekend = selectedDate.getDay() === 0

  return (
    <Card fullWidth className="max-w-sm md:min-h-full md:max-w-2xl">
      <CardHeader className="border-b px-6 py-4">
        <div className="flex w-full items-center justify-between font-semibold">
          <div className="flex items-center gap-2">
            <p>{selectedDate && formatDate(selectedDate)}</p>
            <Button isIconOnly className={cn(isWeekend ? 'hidden' : '')} color="danger" size="sm" variant="light">
              <span className="font-semibold">Add</span>
            </Button>
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
            <Drawer.Root key={entry.id} open={isOpen} onOpenChange={onOpenChange}>
              <Drawer.Trigger>
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
                    <div className="flex flex-col">
                      <Button className="w-full" variant="light" onPress={onOpenChange}>
                        <span className="font-semibold">Edit</span>
                      </Button>
                      <Button className="w-full" color="danger" variant="light" onPress={onOpenChange}>
                        <span className="font-semibold">Delete</span>
                      </Button>
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

export default AttendanceInfo
