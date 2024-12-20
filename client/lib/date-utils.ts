import {
  endOfDay,
  endOfMonth,
  endOfWeek,
  endOfYear,
  format,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
} from 'date-fns'

interface DateObject {
  day: string
  date: string
  isHoliday: boolean
  holidayReason: string | null
}

export function getHolidays(year: number, month: number) {
  // This is a sample list of holidays. You would need to replace this with your own list of holidays.
  const holidays = [
    { date: '2024-12-25', reason: 'Christmas Day' },
    // Add more holidays here...
  ]

  return holidays.filter((holiday) => holiday.date.startsWith(`${year}-${month.toString().padStart(2, '0')}`))
}

export function getDatesOfMonth(year: number, month: number): DateObject[] {
  const dates: DateObject[] = []
  const lastDayOfMonth = new Date(year, month, 0)
  const holidays = getHolidays(year, month)

  for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
    const date = new Date(year, month - 1, i)
    const day = date.toLocaleString('en-us', { weekday: 'long' })
    const isHoliday =
      !!holidays.find(
        (holiday) =>
          holiday.date === date.toLocaleString('en-us', { year: 'numeric', month: '2-digit', day: '2-digit' })
      )?.date ||
      date.getDay() === 0 ||
      date.getDay() === 6

    const holidayReason = isHoliday
      ? holidays.find(
          (holiday) =>
            holiday.date === date.toLocaleString('en-us', { year: 'numeric', month: '2-digit', day: '2-digit' })
        )?.reason || 'Non-working day (Weekend)'
      : null

    dates.push({
      day,
      date: date.toLocaleString('en-us', { year: 'numeric', month: '2-digit', day: '2-digit' }),
      isHoliday,
      holidayReason,
    })
  }

  return dates
}

export function getStartAndEndOfMonth(date: Date) {
  const startDateDay = format(startOfDay(date), 'yyyy-MM-dd')
  const endDateDay = format(endOfDay(date), 'yyyy-MM-dd')

  const startDateWeek = format(startOfWeek(date), 'yyyy-MM-dd')
  const endDateWeek = format(endOfWeek(date), 'yyyy-MM-dd')

  const startDateMonth = format(startOfMonth(date), 'yyyy-MM-dd')
  const endDateMonth = format(endOfMonth(date), 'yyyy-MM-dd')

  const startDateYear = format(startOfYear(date), 'yyyy-MM-dd')
  const endDateYear = format(endOfYear(date), 'yyyy-MM-dd')

  return {
    startDateDay,
    endDateDay,
    startDateWeek,
    endDateWeek,
    startDateMonth,
    endDateMonth,
    startDateYear,
    endDateYear,
  }
}

export function getMonthYear(date: Date | null): { month: number; year: number } {
  const dateObj = date || new Date()
  const month = dateObj.getMonth() + 1 // Months are 0-based, so we add 1 to get the correct month
  const year = dateObj.getFullYear()

  return { month, year }
}
