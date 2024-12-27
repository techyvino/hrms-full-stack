import { differenceInMinutes, format } from 'date-fns'

export const formatTime = (date: string | Date): string => {
  return format(new Date(date), 'HH:mm')
}

export const formatDate = (
  date: string | Date,
  formatStr = 'MMM dd, yyyy'
): string => {
  return format(new Date(date), formatStr)
}

export const durationByMinutes = (
  minutes: number,
  hoursSuffix: string = '',
  minutesSuffix: string = ''
): string => {
  if (minutes < 0) {
    return '--:--'
  }
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60

  return `${hours.toString().padStart(2, '0')}${hoursSuffix}:${remainingMinutes.toString().padStart(2, '0')}${minutesSuffix}`
}

export const calculateMinutes = (
  clockOut: string | Date,
  clockIn: string | Date
): number => {
  if (!clockOut || !clockIn) {
    return 0
  }

  return differenceInMinutes(new Date(clockOut), new Date(clockIn))
}

export const calculateDuration = (
  clockIn: string,
  clockOut: string | null,
  hoursSuffix: string = '',
  minutesSuffix: string = ''
): string => {
  if (!clockOut || !clockIn) {
    return '--:--'
  }

  const minutes = differenceInMinutes(new Date(clockOut), new Date(clockIn))

  return durationByMinutes(minutes, hoursSuffix, minutesSuffix)
}
