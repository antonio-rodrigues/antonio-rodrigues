import { 
  isWeekend
} from 'date-fns'

export interface Day {
  date: Date
  dayOfMonth: number
  isWeekend: boolean
  isHoliday?: boolean
  holidayName?: string
  holidayType?: 'national' | 'municipal'
  holidayMunicipalityName?: string
}

export interface Month {
  days: Day[]
  firstDayOffset: number
  index: number
}

export function useCalendar() {
  const getYearData = (year: number, locale: 'pt' | 'en' = 'pt'): Month[] => {
    const months: Month[] = []

    for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
      // Create date for the 1st of the month at 00:00:00 (local)
      const monthStart = new Date(year, monthIndex, 1)
      
      // Calculate days in month (next month index with day 0)
      const monthEnd = new Date(year, monthIndex + 1, 0)
      const numDays = monthEnd.getDate()

      const days: Day[] = []
      for (let dayNum = 1; dayNum <= numDays; dayNum++) {
        const date = new Date(year, monthIndex, dayNum)
        days.push({
          date,
          dayOfMonth: dayNum,
          isWeekend: isWeekend(date)
        })
      }

      // getDay() returns 0 for Sunday, 1 for Monday, ..., 6 for Saturday
      const firstDay = monthStart.getDay()
      
      // Sunday-start (en): Sun=0, Mon=1, ..., Sat=6
      // Monday-start (pt): Mon=0, Tue=1, ..., Sun=6
      const firstDayOffset = locale === 'en' 
        ? firstDay 
        : (firstDay + 6) % 7

      months.push({
        days,
        firstDayOffset,
        index: monthIndex
      })
    }

    return months
  }

  return {
    getYearData
  }
}
