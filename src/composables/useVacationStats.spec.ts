import { describe, it, expect } from 'vitest'
import { ref } from 'vue'
import { useVacationStats } from './useVacationStats'

describe('useVacationStats', () => {
  it('usedWorkDays counts only marked workdays', () => {
    const year = ref(2026)
    const markedDays = ref(new Set([
      '2026-01-01', // Holiday (Thu)
      '2026-01-02', // Workday (Fri)
      '2026-01-03', // Weekend (Sat)
      '2026-01-04', // Weekend (Sun)
      '2026-01-05', // Workday (Mon)
    ]))
    const holidays = ref(new Map([['2026-01-01', { name: 'New Year' }]]))
    const maxVacationDays = ref(22)

    const { usedWorkDays } = useVacationStats(year, markedDays, holidays, maxVacationDays)
    
    // Marked: Jan 1 (Holiday), Jan 2 (Workday), Jan 3 (Weekend), Jan 4 (Weekend), Jan 5 (Workday)
    // Only Jan 2 and Jan 5 are workdays -> 2
    expect(usedWorkDays.value).toBe(2)
  })

  it('totalSelectedDays counts all marked days', () => {
    const year = ref(2026)
    const markedDays = ref(new Set([
      '2026-01-01', // Holiday
      '2026-01-02', // Workday
      '2026-01-03', // Weekend
    ]))
    const holidays = ref(new Map([['2026-01-01', { name: 'New Year' }]]))
    const maxVacationDays = ref(22)

    const { totalSelectedDays } = useVacationStats(year, markedDays, holidays, maxVacationDays)
    
    expect(totalSelectedDays.value).toBe(3)
  })

  it('remainingDays = max - used', () => {
    const year = ref(2026)
    const markedDays = ref(new Set(['2026-01-02', '2026-01-05'])) // 2 workdays
    const holidays = ref(new Map())
    const maxVacationDays = ref(22)

    const { remainingDays } = useVacationStats(year, markedDays, holidays, maxVacationDays)
    
    expect(remainingDays.value).toBe(20)
  })

  it('remainingDays can go negative', () => {
    const year = ref(2026)
    const markedDays = ref(new Set(['2026-01-02', '2026-01-05'])) // 2 workdays
    const holidays = ref(new Map())
    const maxVacationDays = ref(1)

    const { remainingDays } = useVacationStats(year, markedDays, holidays, maxVacationDays)
    
    expect(remainingDays.value).toBe(-1)
  })

  it('isOverBudget is true when used > max', () => {
    const year = ref(2026)
    const markedDays = ref(new Set(['2026-01-02', '2026-01-05'])) // 2 workdays
    const holidays = ref(new Map())
    const maxVacationDays = ref(1)

    const { isOverBudget } = useVacationStats(year, markedDays, holidays, maxVacationDays)
    
    expect(isOverBudget.value).toBe(true)
  })

  it('isOverBudget is false when used <= max', () => {
    const year = ref(2026)
    const markedDays = ref(new Set(['2026-01-02', '2026-01-05'])) // 2 workdays
    const holidays = ref(new Map())
    const maxVacationDays = ref(2)

    const { isOverBudget } = useVacationStats(year, markedDays, holidays, maxVacationDays)
    
    expect(isOverBudget.value).toBe(false)
  })

  describe('longestRestPeriod', () => {
    it('counts weekend alone', () => {
      const year = ref(2026)
      const markedDays = ref(new Set([]))
      const holidays = ref(new Map())
      const maxVacationDays = ref(22)

      const { longestRestPeriod } = useVacationStats(year, markedDays, holidays, maxVacationDays)
      
      // Jan 3-4 2026 is Sat-Sun
      expect(longestRestPeriod.value).toBe(2)
    })

    it('extends weekend with vacation', () => {
      const year = ref(2026)
      const markedDays = ref(new Set(['2026-01-02'])) // Friday
      const holidays = ref(new Map())
      const maxVacationDays = ref(22)

      const { longestRestPeriod } = useVacationStats(year, markedDays, holidays, maxVacationDays)
      
      // Fri (marked) + Sat + Sun = 3
      expect(longestRestPeriod.value).toBe(3)
    })

    it('resets at workday', () => {
      const year = ref(2026)
      const markedDays = ref(new Set(['2026-01-02', '2026-01-05'])) // Friday and Monday
      const holidays = ref(new Map())
      const maxVacationDays = ref(22)

      const { longestRestPeriod } = useVacationStats(year, markedDays, holidays, maxVacationDays)
      
      // Fri (marked) + Sat + Sun + Mon (marked) = 4
      expect(longestRestPeriod.value).toBe(4)

      // Add a workday in between (e.g. Jan 6 Tue is unmarked)
      // Fri (2) + Sat (3) + Sun (4) + Mon (5) = 4
      // Tue (6) breaks it
    })

    it('handles holidays on Wednesday', () => {
      const year = ref(2026)
      const markedDays = ref(new Set([]))
      const holidays = ref(new Map([['2026-01-07', { name: 'Holiday' }]])) // Jan 7 is Wed
      const maxVacationDays = ref(22)

      const { longestRestPeriod } = useVacationStats(year, markedDays, holidays, maxVacationDays)
      
      // Jan 3-4 is weekend (2)
      // Jan 7 is holiday (1)
      // Longest is 2
      expect(longestRestPeriod.value).toBe(2)
    })

    it('complex chain with holiday and vacation', () => {
      const year = ref(2026)
      const markedDays = ref(new Set([
        '2026-01-05', // Mon
        '2026-01-06', // Tue
        // Jan 7 (Wed) - workday (unmarked)
        '2026-01-09', // Fri
      ]))
      const holidays = ref(new Map([['2026-01-08', { name: 'Holiday' }]])) // Jan 8 is Thu
      const maxVacationDays = ref(22)

      const { longestRestPeriod } = useVacationStats(year, markedDays, holidays, maxVacationDays)
      
      // Jan 1-4: Thu (holiday?), Fri, Sat, Sun
      // Wait, let's re-calculate based on actual 2026 calendar
      // Jan 1 is Thu
      // Jan 2 is Fri
      // Jan 3-4 is Sat-Sun
      // If we don't have holidays: Jan 3-4 is 2.
      
      // Test case: Fri (9) + Thu (8 holiday) + Sat (10) + Sun (11) = 4 days run
      // Mon (5) + Tue (6) = 2 days run
      // Jan 7 (Wed) breaks it.
      
      expect(longestRestPeriod.value).toBe(4)
    })
  })
})
