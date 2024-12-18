'use client'

import 'react-calendar/dist/Calendar.css'

import Calendar from 'react-calendar'

import { title } from '@/components/primitives'
import { cn } from '@/lib/utils'

export default function AttendancePage() {
  return (
    <div>
      <h1 className={title()}>About</h1>
      <Calendar
        calendarType="gregory"
        className="rounded-lg dark:bg-background"
        defaultValue={new Date()}
        next2Label={null}
        prev2Label={null}
        tileClassName={({ date, view }) => cn(view === 'month' && date.getDay() === 0 && 'text-danger')}
      />
    </div>
  )
}
