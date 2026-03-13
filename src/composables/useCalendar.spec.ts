import { describe, it, expect, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useCalendar } from './useCalendar'
import { useConfigStore } from '../store/config'
import type { Day } from './useCalendar'

describe('useCalendar', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('Day interface supports optional holiday fields', () => {
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
    expect(january.days[0].isWeekend).toBe(false) // Jan 1st
    expect(january.days[2].isWeekend).toBe(true)  // Jan 3rd
    expect(january.days[3].isWeekend).toBe(true)  // Jan 4th
  })

  it('January 1st 2026 should have the correct weekday offset based on locale', () => {
    const configStore = useConfigStore()
    const { getYearData } = useCalendar()
    
    // Test PT locale (Monday-start)
    // Jan 1st 2026 is a Thursday
    // PT: Mon=0, Tue=1, Wed=2, Thu=3, Fri=4, Sat=5, Sun=6
    configStore.locale = 'pt'
    let months = getYearData(2026)
    expect(months[0].firstDayOffset).toBe(3)

    // Test EN locale (Sunday-start)
    // EN: Sun=0, Mon=1, Tue=2, Wed=3, Thu=4, Fri=5, Sat=6
    configStore.locale = 'en'
    months = getYearData(2026)
    expect(months[0].firstDayOffset).toBe(4)
  })
})
