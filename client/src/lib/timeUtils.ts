'use client'
import { differenceInMinutes, format, parseISO } from 'date-fns'
import { DateTime } from 'luxon'

export const formatTime = (date: string | Date): string => {
  return format(new Date(date), 'HH:mm')
}

export const formatDate = (date: string | Date, formatStr = 'MMM dd, yyyy'): string => {
  return format(new Date(date), formatStr)
}

export const durationByMinutes = (
  minutes: number,
  hoursSuffix: string = '',
  minutesSuffix: string = '',
  padStart: number = 2
): string => {
  if (minutes < 0 || minutes === 0) return '-- : --'
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = Math.floor(minutes % 60)

  return `${hours.toString().padStart(padStart, '0')}${hoursSuffix} : ${remainingMinutes.toString().padStart(padStart, '0')}${minutesSuffix}`
}

export const calculateMinutes = (clockOut: string | null, clockIn: string): number => {
  if (!clockOut || !clockIn) return 0

  return differenceInMinutes(new Date(clockOut), new Date(clockIn))
}

export const calculateDuration = (
  clockIn: string,
  clockOut: string | null,
  hoursSuffix: string = '',
  minutesSuffix: string = ''
): string => {
  if (!clockOut) return '--:--'

  const clockInDateTime = parseISO(clockIn)
  const clockOutDateTime = parseISO(clockOut)

  const minutes = differenceInMinutes(clockOutDateTime, clockInDateTime, {
    roundingMethod: 'floor',
  })

  return durationByMinutes(minutes, hoursSuffix, minutesSuffix)
}

export const dateTimeNow = () => {
  // Create a DateTime object in IST
  const istDateTime = DateTime.now().setZone('Asia/Kolkata')
  // Format the DateTime object like '10/14/1983, 9:30:33 AM'.
  const formattedDateTime = istDateTime.toFormat("yyyy-MM-dd'T'HH:mm:ss")

  return formattedDateTime
}

export const calculateWorkAndBreakTime = (entries: { clock_in: string; clock_out: string }[]) => {
  let totalWorkTimeInSeconds = 0
  let totalBreakTimeInSeconds = 0

  const clonedEntries = [...entries]

  // Sort entries by clock-in time
  const sortedEntries = clonedEntries.sort((a, b) => new Date(a.clock_in).getTime() - new Date(b.clock_in).getTime())

  // Convert time strings to Date objects using date-fns
  const timeToSeconds = (time: Date): number => {
    return time.getTime() / 1000 // Return the time in seconds
  }

  for (let i = 0; i < sortedEntries.length; i++) {
    const currentEntry = sortedEntries[i]

    if (currentEntry.clock_in && currentEntry.clock_out) {
      const clockInTime = currentEntry?.clock_in ? timeToSeconds(parseISO(currentEntry?.clock_in)) : 0
      const clockOutTime = currentEntry?.clock_out
        ? timeToSeconds(parseISO(currentEntry?.clock_out))
        : new Date().getTime() / 1000 // Use current time if no clock-out time is available

      // Add to total work time (clock-out - clock-in)
      totalWorkTimeInSeconds += clockOutTime - clockInTime

      // Calculate break time (if there is a next entry, calculate the break time as the difference between current clock-out and next clock-in)
      if (i < sortedEntries.length - 1) {
        const nextClockInEntry = sortedEntries[i + 1]?.clock_in
        const nextClockInTime = nextClockInEntry ? timeToSeconds(parseISO(nextClockInEntry)) : 0

        if (nextClockInTime > clockOutTime) {
          totalBreakTimeInSeconds += nextClockInTime - clockOutTime
        }
      }
    }
  }
  const totalWorkTimeInMinutes = totalWorkTimeInSeconds / 60 // Convert seconds to minutes
  const totalBreakTimeInMinutes = totalBreakTimeInSeconds / 60 // Convert seconds to minutes

  return {
    totalWorkTimeInMinutes,
    totalBreakTimeInMinutes,
    totalWorkTime: durationByMinutes(totalWorkTimeInMinutes, 'h', 'm'),
    totalBreakTime: durationByMinutes(totalBreakTimeInMinutes, 'h', 'm'),
  }
}
