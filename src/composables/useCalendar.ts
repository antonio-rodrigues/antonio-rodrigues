import { 
  eachMonthOfInterval, 
  eachDayOfInterval, 
  startOfMonth, 
  endOfMonth, 
  getDay, 
  isWeekend
} from 'date-fns'
import { useConfigStore } from '../store/config'

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
  const configStore = useConfigStore()

  const getYearData = (year: number): Month[] => {
    const startOfYear = new Date(year, 0, 1)
    const endOfYear = new Date(year, 11, 31)

    const months = eachMonthOfInterval({
      start: startOfYear,
      end: endOfYear
    })

    return months.map((monthDate, index) => {
      const monthStart = startOfMonth(monthDate)
      const monthEnd = endOfMonth(monthDate)

      const daysInMonth = eachDayOfInterval({
        start: monthStart,
        end: monthEnd
      })

      // getDay returns 0 for Sunday, 1 for Monday, ..., 6 for Saturday
      const firstDay = getDay(monthStart)
      
      // Locale 'en': Sunday = 0, ..., Saturday = 6
      // Locale 'pt': Monday = 0, ..., Saturday = 5, Sunday = 6
      const firstDayOffset = configStore.locale === 'en' 
        ? firstDay 
        : (firstDay + 6) % 7

      const days: Day[] = daysInMonth.map(date => ({
        date,
        dayOfMonth: date.getDate(),
        isWeekend: isWeekend(date)
      }))

      return {
        days,
        firstDayOffset,
        index
      }
    })
  }

  return {
    getYearData
  }
}

