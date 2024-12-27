import React from 'react'

import useTimeDifference from '@/hooks/useTimeDifference'

const ActiveTimeDiff = ({ clockIn }: { clockIn: string }) => {
  const { hours, minutes } = useTimeDifference(new Date(clockIn))

  return (
    <div className="min-w-24 rounded-lg text-center text-2xl">
      <span>{`${hours || 0}h`}</span>
      <span className="mx-1 animate-pulse">:</span>
      <span>{`${minutes || 0}m`}</span>
      <p className="text-center text-sm">Hours worked</p>
    </div>
  )
}

export default ActiveTimeDiff
