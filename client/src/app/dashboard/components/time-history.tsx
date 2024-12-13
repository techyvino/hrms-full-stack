import { History } from 'lucide-react'

import type { ClockEntry } from '@/app/dashboard/schemas'
import { calculateDuration, formatDate, formatTime } from '@/lib/timeUtils'
import { cn } from '@/lib/utils'

export const TimeHistory = ({ entries }: { entries: ClockEntry[] }) => {
  // const distanceInMins = (clock_in_time: string) =>
  //   clock_in_time &&
  //   formatDistanceToNow(clock_in_time, {
  //     addSuffix: true,
  //     includeSeconds: true,
  //   })
  return (
    <div className="rounded-lg bg-white shadow">
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center">
          <History className="mr-2 size-5 text-gray-600" />
          <h3 className="text-lg font-medium text-gray-900">Time History</h3>
        </div>
      </div>
      <div className="divide-y divide-gray-200">
        {entries?.length === 0 ? (
          <div>No History</div>
        ) : (
          entries?.map((entry) => (
            <div key={entry.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-900">{formatDate(entry.date)}</div>
                  <div className="text-sm text-gray-500">
                    <p>
                      {formatTime(entry.clock_in)} - {entry.clock_out ? formatTime(entry.clock_out) : 'Active'}
                    </p>
                  </div>
                </div>
                <div className="text-sm font-medium text-gray-900">
                  <div className="flex items-center justify-center gap-1">
                    <div
                      className={cn(
                        'size-3 rounded-full',
                        entry.clock_out ? 'bg-gray-400' : 'bg-green-500 animate-pulse '
                      )}
                    />
                    <div className="m-0 p-0">
                      {calculateDuration(entry.clock_in, entry.clock_out || new Date().toISOString())}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
