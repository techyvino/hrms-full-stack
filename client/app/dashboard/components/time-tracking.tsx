import { Badge, Button, Card, CardBody, CardHeader, Skeleton } from '@nextui-org/react'
import { Clock4, Clock10, LogIn } from 'lucide-react'
import React from 'react'

import type { ClockedStatusData } from '@/app/dashboard/schemas'
import useTimeDifference from '@/hooks/useTimeDifference'
import { cn } from '@/lib/utils'

interface TimeTrackingProps {
  handlePunchClock: () => void
  data: ClockedStatusData | undefined
  isLoading: boolean
  isSubmitting: boolean
}

const TimeTracking = ({ handlePunchClock, data, isLoading, isSubmitting }: TimeTrackingProps) => {
  const isActive = data?.clock_in_time && !data?.clock_out_time

  const { hours, minutes } = useTimeDifference(new Date(data?.clock_in_time || ''))

  return (
    <Card>
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-lg">
            <Clock10 />
            {`Today’s attendance`}
          </div>
          {isActive && (
            <Badge color="success">
              <Clock4 className="mr-1 size-4" />
              <p className={cn('text-md')}>Active</p>
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardBody>
        <div className="my-5 flex justify-center gap-4">
          <Button className="w-36" color="primary" isLoading={isSubmitting} variant="shadow" onPress={handlePunchClock}>
            <LogIn />
            {data?.next_clock_action === 'in' ? 'Clock In' : 'Clock Out'}
          </Button>
        </div>
        <div className="flex justify-center">
          {isLoading ? (
            <Skeleton className="h-8 w-28" />
          ) : (
            <>
              {isActive && (
                <div className="min-w-24 rounded-lg text-center text-2xl">
                  <span>{`${hours || 0}h`}</span>
                  <span className="mx-1 animate-pulse">:</span>
                  <span>{`${minutes || 0}m`}</span>
                  <p className="text-center text-sm">Hours worked</p>
                </div>
              )}
            </>
          )}
        </div>
      </CardBody>
    </Card>
  )
}

export default TimeTracking
