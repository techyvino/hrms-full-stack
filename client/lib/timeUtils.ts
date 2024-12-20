import { differenceInMinutes, format } from 'date-fns'
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
  if (minutes < 0 || minutes === 0) return '--:--'
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60

  return `${hours.toString().padStart(padStart, '0')}${hoursSuffix}:${remainingMinutes.toString().padStart(padStart, '0')}${minutesSuffix}`
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
  if (!clockOut || !clockIn) return '--:--'

  const minutes = differenceInMinutes(new Date(clockOut), new Date(clockIn))

  return durationByMinutes(minutes, hoursSuffix, minutesSuffix)
}

export const dateTimeNow = () => {
  // Create a DateTime object in IST
  const istDateTime = DateTime.now().setZone('Asia/Kolkata')
  // Format the DateTime object like '10/14/1983, 9:30:33 AM'.
  const formattedDateTime = istDateTime.toFormat("yyyy-MM-dd'T'HH:mm:ss")

  return formattedDateTime
}
