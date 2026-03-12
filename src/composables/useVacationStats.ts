import { computed } from 'vue'
import { eachDayOfInterval, startOfYear, endOfYear, format, isWeekend } from 'date-fns'
import type { Ref, ComputedRef } from 'vue'

export function useVacationStats(
  year: Ref<number>,
  markedDays: Ref<Set<string>>,
  holidays: Ref<Map<string, unknown>>,
  maxVacationDays: Ref<number>
): {
  usedWorkDays: ComputedRef<number>
  remainingDays: ComputedRef<number>
  isOverBudget: ComputedRef<boolean>
  longestRestPeriod: ComputedRef<number>
} {
  const usedWorkDays = computed(() => {
    let count = 0
    for (const dateStr of markedDays.value) {
      // Use new Date(dateStr + 'T00:00:00') to avoid timezone shift
      const date = new Date(dateStr + 'T00:00:00')
      if (!isWeekend(date) && !holidays.value.has(dateStr)) {
        count++
      }
    }
    return count
  })

  const remainingDays = computed(() => maxVacationDays.value - usedWorkDays.value)
  const isOverBudget = computed(() => usedWorkDays.value > maxVacationDays.value)

  const longestRestPeriod = computed(() => {
    // Spec: Year boundary is within the displayed year only
    const allDays = eachDayOfInterval({
      start: startOfYear(new Date(year.value, 0, 1)),
      end: endOfYear(new Date(year.value, 0, 1))
    })
    
    let maxRun = 0
    let currentRun = 0
    
    for (const date of allDays) {
      const dateStr = format(date, 'yyyy-MM-dd')
      const isRest =
        isWeekend(date) ||
        holidays.value.has(dateStr) ||
        markedDays.value.has(dateStr)
        
      if (isRest) {
        currentRun++
        if (currentRun > maxRun) {
          maxRun = currentRun
        }
      } else {
        currentRun = 0
      }
    }
    
    return maxRun
  })

  return { usedWorkDays, remainingDays, isOverBudget, longestRestPeriod }
}
