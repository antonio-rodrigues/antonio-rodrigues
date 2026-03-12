import { describe, it, expect } from 'vitest'
import { useCalendar } from './useCalendar'
import type { Day } from './useCalendar'

describe('useCalendar', () => {
  it('Day interface supports optional holiday fields', () => {
    // TypeScript compile check — if Day doesn't have these fields, this will fail at tsc
    const day: Day = {
      date: new Date(2026, 0, 1),
      dayOfMonth: 1,
      isWeekend: false,
      isHoliday: true,
      holidayName: 'Ano Novo',
      holidayType: 'national',
      holidayMunicipalityName: undefined
    }
    expect(day.isHoliday).toBe(true)
    expect(day.holidayName).toBe('Ano Novo')
    expect(day.holidayType).toBe('national')
  })
  it('should return 12 months for 2026', () => {
    const { getYearData } = useCalendar()
    const months = getYearData(2026)
    expect(months).toHaveLength(12)
  })

  it('should return 28 days for February 2026', () => {
    const { getYearData } = useCalendar()
    const months = getYearData(2026)
    const february = months[1]
    expect(february.days).toHaveLength(28)
  })

  it('should return 29 days for February 2024', () => {
    const { getYearData } = useCalendar()
    const months = getYearData(2024)
    const february = months[1]
    expect(february.days).toHaveLength(29)
  })

  it('should correctly identify weekends', () => {
    const { getYearData } = useCalendar()
    const months = getYearData(2026)
    const january = months[0]
    
    // Jan 1st 2026 is a Thursday
    // Jan 3rd 2026 is a Saturday
    // Jan 4th 2026 is a Sunday
    expect(january.days[0].isWeekend).toBe(false) // Jan 1st
    expect(january.days[2].isWeekend).toBe(true)  // Jan 3rd
    expect(january.days[3].isWeekend).toBe(true)  // Jan 4th
  })

  it('January 1st 2026 should have the correct weekday offset (Monday = 0)', () => {
    const { getYearData } = useCalendar()
    const months = getYearData(2026)
    const january = months[0]
    
    // Jan 1st 2026 is a Thursday
    // Mon=0, Tue=1, Wed=2, Thu=3, Fri=4, Sat=5, Sun=6
    expect(january.firstDayOffset).toBe(3)
  })
})
