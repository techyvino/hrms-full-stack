'use client'

import Header from '@/app/dashboard/header'
import TimeTracking from '@/app/dashboard/time-tracking'
import { TimeHistory } from '@/app/dashboard/TimeHistory'

export default function Home() {
  return (
    <main>
      <Header />
      <div className="mx-5 space-y-5">
        <TimeTracking />
        <TimeHistory />
      </div>
    </main>
  )
}
