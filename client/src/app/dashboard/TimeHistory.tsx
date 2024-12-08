import { History } from 'lucide-react'

import { calculateDuration, formatDate, formatTime } from '@/lib/timeUtils'

export function TimeHistory() {
  const mockTimeEntries = [
    {
      id: '1',
      employeeId: '1',
      clockIn: '2024-02-20T09:00:00Z',
      clockOut: '2024-02-20T17:00:00Z',
      date: '2024-02-20',
    },
    {
      id: '2',
      employeeId: '1',
      clockIn: '2024-02-19T08:30:00Z',
      clockOut: '2024-02-19T16:30:00Z',
      date: '2024-02-19',
    },
  ]
  return (
    <div className="rounded-lg bg-white shadow">
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center">
          <History className="mr-2 size-5 text-gray-600" />
          <h3 className="text-lg font-medium text-gray-900">Time History</h3>
        </div>
      </div>
      <div className="divide-y divide-gray-200">
        {mockTimeEntries.map((entry) => (
          <div key={entry.id} className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-900">{formatDate(entry.date)}</div>
                <div className="text-sm text-gray-500">
                  {formatTime(entry.clockIn)} - {entry.clockOut ? formatTime(entry.clockOut) : 'Active'}
                </div>
              </div>
              <div className="text-sm font-medium text-gray-900">
                Duration: {calculateDuration(entry.clockIn, entry.clockOut)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
