'use client'
import { Card, CardBody, CardHeader } from '@nextui-org/react'
import { History } from 'lucide-react'

import type { ClockEntry } from '@/app/dashboard/schemas'
import { calculateDuration, formatDate, formatTime } from '@/lib/timeUtils'
import { cn } from '@/lib/utils'

export const TimeHistory = ({ entries = [] }: { entries: ClockEntry[] }) => {
  return (
    <Card className="">
      <CardHeader className="border-b px-6 py-4">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <History />
          <h3 className="">{"Today's Clocked History"}</h3>
        </div>
      </CardHeader>
      <CardBody className="divide-y">
        {entries?.length === 0 ? (
          <div className="flex items-center justify-center p-4 font-semibold">Clocked history not found</div>
        ) : (
          entries?.map((entry) => (
            <div key={entry.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">{formatDate(entry.date)}</div>
                  <div className="text-sm">
                    <p>
                      {formatTime(entry.clock_in)} - {entry.clock_out ? formatTime(entry.clock_out) : 'Active'}
                    </p>
                  </div>
                </div>
                <div className="text-sm font-medium">
                  <div className="flex items-center justify-center gap-1">
                    <div
                      className={cn('size-3 rounded-full', entry.clock_out ? 'hidden' : 'bg-green-500 animate-pulse ')}
                    />
                    <div className="m-0 p-0">
                      {entry?.clock_out ? calculateDuration(entry.clock_in, entry.clock_out) : 'Active'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </CardBody>
    </Card>
  )
}
