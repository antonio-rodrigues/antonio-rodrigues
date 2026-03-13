import { 
  eachMonthOfInterval, 
  eachDayOfInterval, 
  startOfMonth, 
  endOfMonth, 
  getDay, 
  isWeekend,
  format
} from 'date-fns'
import { pt } from 'date-fns/locale'

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
  name: string
  days: Day[]
  firstDayOffset: number
  index?: number
}

export function useCalendar() {
  const getYearData = (year: number): Month[] => {
    const startOfYear = new Date(year, 0, 1)
    const endOfYear = new Date(year, 11, 31)

    const months = eachMonthOfInterval({
      start: startOfYear,
      end: endOfYear
    })

    return months.map(monthDate => {
      const monthStart = startOfMonth(monthDate)
      const monthEnd = endOfMonth(monthDate)

      const daysInMonth = eachDayOfInterval({
        start: monthStart,
        end: monthEnd
      })

      // getDay returns 0 for Sunday, 1 for Monday, ..., 6 for Saturday
      // We want Monday = 0, ..., Saturday = 5, Sunday = 6
      // (getDay(date) + 6) % 7
      const firstDay = getDay(monthStart)
      const firstDayOffset = (firstDay + 6) % 7

      const days: Day[] = daysInMonth.map(date => ({
        date,
        dayOfMonth: date.getDate(),
        isWeekend: isWeekend(date)
      }))

      return {
        name: format(monthDate, 'MMMM', { locale: pt }),
        days,
        firstDayOffset
      }
    })
  }

  return {
    getYearData
  }
}
