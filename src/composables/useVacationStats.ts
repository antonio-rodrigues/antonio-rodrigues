import { computed } from 'vue'
import { eachDayOfInterval, startOfYear, endOfYear, format, isWeekend, differenceInCalendarDays, getDay, subDays, addDays } from 'date-fns'
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
  totalSelectedDays: ComputedRef<number>
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

  const totalSelectedDays = computed(() => {
    // Year boundary is within the displayed year only
    const allDays = eachDayOfInterval({
      start: startOfYear(new Date(year.value, 0, 1)),
      end: endOfYear(new Date(year.value, 0, 1))
    })

    let total = 0
    let currentBlock: Date[] = []

    const processBlock = (block: Date[]) => {
      let hasSelected = false
      let minImportant: Date | null = null
      let maxImportant: Date | null = null

      for (const date of block) {
        const dateStr = format(date, 'yyyy-MM-dd')
        const isSelected = markedDays.value.has(dateStr)
        const isHoliday = holidays.value.has(dateStr)

        if (isSelected) hasSelected = true
        
        if (isSelected || isHoliday) {
          if (!minImportant || date < minImportant) minImportant = date
          if (!maxImportant || date > maxImportant) maxImportant = date
        }
      }

      if (hasSelected && minImportant && maxImportant) {
        let start = minImportant
        let end = maxImportant

        // If minImportant is Monday (1), include preceding weekend if it exists in the block
        if (getDay(start) === 1) {
          const blockStart = block[0]
          const diff = differenceInCalendarDays(start, blockStart)
          if (diff >= 2) {
            start = subDays(start, 2)
          } else if (diff >= 1) {
            start = subDays(start, 1)
          }
        }

        // If maxImportant is Friday (5), include following weekend if it exists in the block
        if (getDay(end) === 5) {
          const blockEnd = block[block.length - 1]
          const diff = differenceInCalendarDays(blockEnd, end)
          if (diff >= 2) {
            end = addDays(end, 2)
          } else if (diff >= 1) {
            end = addDays(end, 1)
          }
        }

        total += differenceInCalendarDays(end, start) + 1
      }
    }

    for (const date of allDays) {
      const dateStr = format(date, 'yyyy-MM-dd')
      const isRest =
        isWeekend(date) ||
        holidays.value.has(dateStr) ||
        markedDays.value.has(dateStr)

      if (isRest) {
        currentBlock.push(date)
      } else {
        if (currentBlock.length > 0) {
          processBlock(currentBlock)
          currentBlock = []
        }
      }
    }

    if (currentBlock.length > 0) {
      processBlock(currentBlock)
    }

    return total
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

  return { usedWorkDays, remainingDays, isOverBudget, longestRestPeriod, totalSelectedDays }
}
