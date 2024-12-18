'use client'

import 'react-calendar/dist/Calendar.css'

import { Card, CardBody, CardHeader } from '@nextui-org/react'
import { useState } from 'react'
import Calendar from 'react-calendar'

import Title from '@/components/title'
import { getMonthYear, getStartAndEndOfMonth } from '@/lib/date-utils'
import { formatDate } from '@/lib/timeUtils'
import { cn } from '@/lib/utils'

export default function AttendancePage() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [activeStartDate, setActiveStartDate] = useState<Date | null>(null)

  const formattedDate = selectedDate ? formatDate(selectedDate) : 'NA'
  const punchDates = ['2024-12-01', '2024-12-02', '2024-12-03', '2024-12-04', '2024-12-05', '2024-12-09']

  const { month, year } = getMonthYear(activeStartDate)
  const { startDate, endDate } = getStartAndEndOfMonth(year, month)

  return (
    <div>
      <Title title="Attendance" />
      <div className="flex w-full flex-col items-center justify-center gap-4 px-4 md:flex-row md:items-start">
        <Card className="mt-4">
          <CardBody>
            <Calendar
              calendarType="gregory"
              className="rounded-lg !border-none px-5 dark:bg-background"
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
                if (view === 'month') {
                  return punchDates.includes(date.toISOString().split('T')[0]) ? (
                    <div className="flex items-end justify-center gap-x-px">
                      <div className="size-2 rounded-none bg-success" />
                      <div className="size-2 rounded-none bg-success" />
                    </div>
                  ) : (
                    date.getDay() !== 0 && (
                      <div className="flex items-end justify-center gap-x-px">
                        <div className="size-2 rounded-none bg-danger-400" />
                        <div className="size-2 rounded-none bg-danger-400" />
                      </div>
                    )
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
        <Card fullWidth className="w-full">
          <CardHeader className="border-b px-6 py-4">
            <div className="flex items-center gap-2 text-lg font-semibold">{formattedDate}</div>
          </CardHeader>
          <CardBody>
            <div className="w-full">{`${startDate.toDateString()} - ${endDate?.toDateString()}`}</div>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
