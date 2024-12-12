import { differenceInMinutes, format } from 'date-fns'
import { DateTime } from 'luxon'

export const formatTime = (date: string | Date): string => {
  return format(new Date(date), 'HH:mm')
}

export const formatDate = (date: string | Date): string => {
  return format(new Date(date), 'MMM dd, yyyy')
}

export const calculateDuration = (clockIn: string, clockOut: string | null): string => {
  if (!clockOut) return '--:--'

  const minutes = differenceInMinutes(new Date(clockOut), new Date(clockIn))
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60

  return `${hours.toString().padStart(2, '0')}:${remainingMinutes.toString().padStart(2, '0')}`
}

export const dateTimeNow = () => {
  // Create a DateTime object in IST
  const istDateTime = DateTime.now().setZone('Asia/Kolkata')
  // Format the DateTime object like '10/14/1983, 9:30:33 AM'.
  const formattedDateTime = istDateTime.toFormat("yyyy-MM-dd'T'HH:mm:ss")

  return formattedDateTime
}
