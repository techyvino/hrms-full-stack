interface DateObject {
  day: string
  date: string
  isHoliday: boolean
  holidayReason: string | null
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

export function getHolidays(year: number, month: number) {
  // This is a sample list of holidays. You would need to replace this with your own list of holidays.
  const holidays = [
    { date: '2024-12-25', reason: 'Christmas Day' },
    // Add more holidays here...
  ]

  return holidays.filter((holiday) => holiday.date.startsWith(`${year}-${month.toString().padStart(2, '0')}`))
}
