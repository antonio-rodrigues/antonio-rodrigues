import { computed } from 'vue'
import { eachDayOfInterval, startOfYear, endOfYear, format, isWeekend, differenceInCalendarDays, getDay, subDays, addDays } from 'date-fns'
import { pt } from 'date-fns/locale'
import type { Ref, ComputedRef } from 'vue'

export interface RestPeriod {
  days: number
  startMonthDay: string
}

export function useVacationStats(
  year: Ref<number>,
  markedDays: Ref<Set<string>>,
  holidays: Ref<Map<string, unknown>>,
  maxVacationDays: Ref<number>
): {
  usedWorkDays: ComputedRef<number>
  remainingDays: ComputedRef<number>
  isOverBudget: ComputedRef<boolean>
  longestRestPeriod: ComputedRef<RestPeriod>
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

        // If minImportant is Monday (1) or Sunday (0), include preceding weekend if it exists in the block
        const startDay = getDay(start)
        const blockStart = block[0]
        const startDiff = differenceInCalendarDays(start, blockStart)

        if (startDay === 1) { // Monday
          if (startDiff >= 2) {
            start = subDays(start, 2)
          } else if (startDiff >= 1) {
            start = subDays(start, 1)
          }
        } else if (startDay === 0) { // Sunday
          if (startDiff >= 1) {
            start = subDays(start, 1)
          }
        }

        // If maxImportant is Friday (5) or Saturday (6), include following weekend if it exists in the block
        const endDay = getDay(end)
        const blockEnd = block[block.length - 1]
        const endDiff = differenceInCalendarDays(blockEnd, end)

        if (endDay === 5) { // Friday
          if (endDiff >= 2) {
            end = addDays(end, 2)
          } else if (endDiff >= 1) {
            end = addDays(end, 1)
          }
        } else if (endDay === 6) { // Saturday
          if (endDiff >= 1) {
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
    
    let maxTotalRun = 0
    let currentBlock: Date[] = []
    let bestBlock: Date[] = []
    
    const finalizeBlock = (block: Date[]) => {
      if (block.length > maxTotalRun) {
        maxTotalRun = block.length
        bestBlock = [...block]
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
        finalizeBlock(currentBlock)
        currentBlock = []
      }
    }
    finalizeBlock(currentBlock)

    if (bestBlock.length === 0) {
      return { days: 0, startMonthDay: '-' }
    }

    // Calculate business days (marked only) in the best block
    let businessDays = 0
    for (const date of bestBlock) {
      const dateStr = format(date, 'yyyy-MM-dd')
      if (markedDays.value.has(dateStr) && !isWeekend(date) && !holidays.value.has(dateStr)) {
        businessDays++
      }
    }

    return {
      days: businessDays,
      startMonthDay: format(bestBlock[0], 'MMM dd', { locale: pt }).toUpperCase()
    }
  })

  return { usedWorkDays, remainingDays, isOverBudget, longestRestPeriod, totalSelectedDays }
}

