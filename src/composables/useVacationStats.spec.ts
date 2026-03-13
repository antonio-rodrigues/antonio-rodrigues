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

  it('totalSelectedDays counts consecutive days including holidays and weekends in the interval (User Example 1 - Updated with Weekend Rule)', () => {
    const year = ref(2026)
    // 2026-02-16 (Mon), 18 (Wed), 19 (Thu), 20 (Fri) selected
    // 2026-02-17 (Tue) is a holiday
    // New rule: Mon 16 triggers previous weekend (14-15). Fri 20 triggers following weekend (21-22).
    const markedDays = ref(new Set([
      '2026-02-16',
      '2026-02-18',
      '2026-02-19',
      '2026-02-20',
    ]))
    const holidays = ref(new Map([['2026-02-17', { name: 'Carnaval' }]]))
    const maxVacationDays = ref(22)

    const { totalSelectedDays } = useVacationStats(year, markedDays, holidays, maxVacationDays)
    
    // Interval 14 to 22 = 9 days.
    expect(totalSelectedDays.value).toBe(9)
  })

  it('totalSelectedDays counts consecutive days including holidays and weekends in the interval (User Example 2)', () => {
    const year = ref(2026)
    // 2026-04-01 (Wed), 02 (Thu) selected
    // 2026-04-03 (Fri) is Good Friday holiday
    // 2026-04-05 (Sun) is Easter holiday
    const markedDays = ref(new Set([
      '2026-04-01',
      '2026-04-02',
    ]))
    const holidays = ref(new Map([
      ['2026-04-03', { name: 'Good Friday' }],
      ['2026-04-05', { name: 'Easter' }]
    ]))
    const maxVacationDays = ref(22)

    const { totalSelectedDays } = useVacationStats(year, markedDays, holidays, maxVacationDays)
    
    // Interval 01 to 05 = 5 days (Wed to Sun). 
    // 01, 02 S; 03 H; 04 Weekend; 05 H.
    // Range is [01, 05].
    expect(totalSelectedDays.value).toBe(5)
  })

  it('totalSelectedDays includes previous weekend if block starts on Monday (User New Rule)', () => {
    const year = ref(2026)
    // 2026-01-05 (Mon) selected
    // Should include Jan 3-4 (Sat-Sun)
    const markedDays = ref(new Set(['2026-01-05']))
    const holidays = ref(new Map())
    const maxVacationDays = ref(22)

    const { totalSelectedDays } = useVacationStats(year, markedDays, holidays, maxVacationDays)
    
    // Sat (3), Sun (4), Mon (5) = 3 days
    expect(totalSelectedDays.value).toBe(3)
  })

  it('totalSelectedDays includes following weekend if block ends on Friday (User New Rule)', () => {
    const year = ref(2026)
    // 2026-01-09 (Fri) selected
    // Should include Jan 10-11 (Sat-Sun)
    const markedDays = ref(new Set(['2026-01-09']))
    const holidays = ref(new Map())
    const maxVacationDays = ref(22)

    const { totalSelectedDays } = useVacationStats(year, markedDays, holidays, maxVacationDays)
    
    // Fri (9), Sat (10), Sun (11) = 3 days
    expect(totalSelectedDays.value).toBe(3)
  })

  it('totalSelectedDays includes weekend if holiday is on Monday/Friday contiguous to selected days', () => {
    const year = ref(2026)
    // 2026-01-01 (Thu) is holiday. 02 (Fri) selected.
    // Block: 01 (H), 02 (S). Ends on Friday -> include Sat-Sun (03, 04)
    const markedDays = ref(new Set(['2026-01-02']))
    const holidays = ref(new Map([['2026-01-01', { name: 'New Year' }]]))
    const maxVacationDays = ref(22)

    const { totalSelectedDays } = useVacationStats(year, markedDays, holidays, maxVacationDays)
    
    // Thu (1), Fri (2), Sat (3), Sun (4) = 4 days
    expect(totalSelectedDays.value).toBe(4)
  })

  it('totalSelectedDays includes previous Saturday if holiday is on Sunday preceding marked Monday', () => {
    const year = ref(2026)
    // 2026-01-04 (Sun) is holiday. 05 (Mon) selected.
    // 2026-01-03 (Sat) should be included.
    const markedDays = ref(new Set(['2026-01-05']))
    const holidays = ref(new Map([['2026-01-04', { name: 'Holiday' }]]))
    const maxVacationDays = ref(22)

    const { totalSelectedDays } = useVacationStats(year, markedDays, holidays, maxVacationDays)
    
    // Sat (3), Sun (4, H), Mon (5, S) = 3 days
    expect(totalSelectedDays.value).toBe(3)
  })

  it('totalSelectedDays includes following Sunday if holiday is on Saturday following marked Friday', () => {
    const year = ref(2026)
    // 2026-01-09 (Fri) selected. 10 (Sat) is holiday.
    // 2026-01-11 (Sun) should be included.
    const markedDays = ref(new Set(['2026-01-09']))
    const holidays = ref(new Map([['2026-01-10', { name: 'Holiday' }]]))
    const maxVacationDays = ref(22)

    const { totalSelectedDays } = useVacationStats(year, markedDays, holidays, maxVacationDays)
    
    // Fri (9, S), Sat (10, H), Sun (11) = 3 days
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
    it('counts business days in weekend alone (0)', () => {
      const year = ref(2026)
      const markedDays = ref(new Set([]))
      const holidays = ref(new Map())
      const maxVacationDays = ref(22)

      const { longestRestPeriod } = useVacationStats(year, markedDays, holidays, maxVacationDays)
      
      // Jan 3-4 2026 is Sat-Sun. Total duration 2, but 0 selected business days.
      expect(longestRestPeriod.value.days).toBe(0)
      expect(longestRestPeriod.value.startMonthDay).toBe('JAN 03')
    })

    it('extends weekend with vacation', () => {
      const year = ref(2026)
      const markedDays = ref(new Set(['2026-01-02'])) // Friday
      const holidays = ref(new Map())
      const maxVacationDays = ref(22)

      const { longestRestPeriod } = useVacationStats(year, markedDays, holidays, maxVacationDays)
      
      // Fri (marked) + Sat + Sun = 3 days block. 
      // Marked business days: 1 (Fri)
      expect(longestRestPeriod.value.days).toBe(1)
      expect(longestRestPeriod.value.startMonthDay).toBe('JAN 02')
    })

    it('resets at workday', () => {
      const year = ref(2026)
      const markedDays = ref(new Set(['2026-01-02', '2026-01-05'])) // Friday and Monday
      const holidays = ref(new Map())
      const maxVacationDays = ref(22)

      const { longestRestPeriod } = useVacationStats(year, markedDays, holidays, maxVacationDays)
      
      // Fri (marked) + Sat + Sun + Mon (marked) = 4 days block.
      // Marked business days: 2 (Fri, Mon)
      expect(longestRestPeriod.value.days).toBe(2)
      expect(longestRestPeriod.value.startMonthDay).toBe('JAN 02')
    })

    it('handles holidays on Wednesday', () => {
      const year = ref(2026)
      const markedDays = ref(new Set([]))
      const holidays = ref(new Map([['2026-01-07', { name: 'Holiday' }]])) // Jan 7 is Wed
      const maxVacationDays = ref(22)

      const { longestRestPeriod } = useVacationStats(year, markedDays, holidays, maxVacationDays)
      
      // Jan 3-4 is weekend (2)
      // Jan 7 is holiday (1)
      // Both have duration 2 and 1 respectively. Max is 2.
      // 0 marked business days.
      expect(longestRestPeriod.value.days).toBe(0)
      expect(longestRestPeriod.value.startMonthDay).toBe('JAN 03')
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
      
      // Block 1: Jan 3-6 (Sat, Sun, Mon (S), Tue (S)) -> duration 4, business 2
      // Block 2: Jan 8-11 (Thu (H), Fri (S), Sat, Sun) -> duration 4, business 1 (Fri)
      
      // Both have duration 4. The first one is JAN 03.
      expect(longestRestPeriod.value.days).toBe(2)
      expect(longestRestPeriod.value.startMonthDay).toBe('JAN 03')
    })
  })
})
