'use client'

import 'react-calendar/dist/Calendar.css'

import { Card, CardBody, Skeleton } from '@nextui-org/react'
import { isWithinInterval } from 'date-fns'
import { redirect, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Calendar from 'react-calendar'

import PunchInfo from '@/app/admin/attendance/punch-details'
import Title from '@/components/title'
import { useFetch } from '@/hooks/useFetch'
import { getStartAndEndOfMonth } from '@/lib/date-utils'
import { formatDate } from '@/lib/timeUtils'
import { activityUrl } from '@/lib/urls'
import { cn } from '@/lib/utils'

export interface Entry {
  id: number
  clockIn: string
  clockOut?: string
  durationInMinutes: number
}

export interface ClockInOut {
  date: string
  entries: Entry[]
  totalDurationInMinutes: number
}

export default function AttendancePage() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [activeStartDate, setActiveStartDate] = useState<Date | null>(null)

  const user_id = useSearchParams().get('id')

  const { fetcher, isLoading, data } = useFetch<ClockInOut[]>()

  const { startDateMonth, endDateMonth } = getStartAndEndOfMonth(activeStartDate || new Date())

  const punchDates = Array.isArray(data) ? [...new Set(data?.map((punch) => punch?.date))] : []

  const selectedPunchInfo = data?.find((punch) => punch?.date === formatDate(selectedDate, 'yyyy-MM-dd'))

  useEffect(() => {
    if (user_id) {
      if (startDateMonth && endDateMonth) {
        fetcher({
          url: activityUrl.attendance(user_id),
          method: 'GET',
          params: {
            startDate: startDateMonth,
            endDate: endDateMonth,
          },
        })
      }
    } else {
      redirect('/admin') // Redirect to the admin page if user_id is not provided
    }
  }, [user_id, startDateMonth, endDateMonth])

  return (
    <div>
      <Title title="Employee Attendance" />
      <div className="flex w-full flex-col items-center justify-center gap-4 px-4">
        <Card className="mt-4">
          <CardBody className="w-full">
            <Skeleton className={cn(isLoading ? 'h-72 w-[22rem] rounded-lg' : 'hidden')} />
            <Calendar
              calendarType="gregory"
              className={cn('rounded-lg !border-none px-5 dark:bg-background/5', isLoading && 'hidden')}
              defaultValue={selectedDate}
              next2Label={null}
              prev2Label={null}
              showNeighboringMonth={false}
              tileClassName={({ date, view }) =>
                cn(
                  view === 'month' && date.getDay() === 0 ? '!text-danger' : '!text-foreground',
                  'flex flex-col items-center'
                )
              }
              // eslint-disable-next-line react/no-unstable-nested-components
              tileContent={({ date, view }) => {
                if (
                  view === 'month' &&
                  punchDates.length > 0 &&
                  isWithinInterval(date, { start: startDateMonth, end: new Date() }) &&
                  date.getDay() !== 0
                ) {
                  return punchDates.includes(formatDate(date, 'yyyy-MM-dd')) ? (
                    <div className="flex items-end justify-center gap-x-px">
                      <div className="size-2 rounded-none bg-success" />
                      <div className="size-2 rounded-none bg-success" />
                    </div>
                  ) : (
                    <div className="flex items-end justify-center gap-x-px">
                      <div className="size-2 rounded-none bg-danger-400" />
                      <div className="size-2 rounded-none bg-danger-400" />
                    </div>
                  )
                }
              }}
              onActiveStartDateChange={(date) => {
                setActiveStartDate(date?.activeStartDate)
              }}
              onClickDay={(date) => {
                setSelectedDate(date)
              }}
            />
          </CardBody>
        </Card>
        <PunchInfo selectedDate={selectedDate} selectedPunchInfo={selectedPunchInfo} />
      </div>
    </div>
  )
}
