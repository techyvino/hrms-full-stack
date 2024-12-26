import { differenceInSeconds } from 'date-fns'
import { useEffect, useState } from 'react'

interface TimeDifference {
  hours: string | number
  minutes: string | number
  seconds: string | number
}

function useTimeDifference(targetDate: Date | null, endDate: Date = new Date()): TimeDifference {
  const [timeDifference, setTimeDifference] = useState<TimeDifference>({ hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    if (!targetDate) return // Exit if targetDate is null

    const now = endDate || new Date()

    const intervalId = setInterval(() => {
      const totalSeconds = differenceInSeconds(now, targetDate) || 0

      // Calculate hours, minutes, and seconds
      const hours = Math.floor(totalSeconds / 3600)
        .toString()
        .padStart(1, '0')
      const minutes = Math.floor((totalSeconds % 3600) / 60)
        .toString()
        .padStart(2, '0')
      const seconds = (totalSeconds % 60).toString().padStart(2, '0')

      // Update state only if the values have changed
      if (timeDifference.hours !== hours || timeDifference.minutes !== minutes || timeDifference.seconds !== seconds) {
        setTimeDifference({ hours, minutes, seconds })
      }
    }, 1000)

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId)
  }, [targetDate, timeDifference])

  return timeDifference
}

export default useTimeDifference
