import { computed } from 'vue'
import { eachDayOfInterval, startOfYear, endOfYear, format, isWeekend, differenceInCalendarDays, getDay, subDays, addDays } from 'date-fns'
import type { Ref, ComputedRef } from 'vue'

export interface RestPeriod {
  days: number
  startDate: Date | null
}

export function useVacationStats(
  year: Ref<number>,
  markedDays: Ref<Set<string>>,
  holidays: Ref<Map<string, unknown>>,
  maxVacationDays: Ref<number>,
  carryOverDays?: Ref<number>
): {
  usedWorkDays: ComputedRef<number>
  usedWorkDaysCurrentYear: ComputedRef<number>
  usedCarryOverDays: ComputedRef<number>
  remainingCarryOverDays: ComputedRef<number>
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

  const usedCarryOverDays = computed(() => {
    const carryOverLimit = Math.max(0, carryOverDays?.value ?? 0)
    if (carryOverLimit === 0) return 0

    const maxCarryOverDate = `${year.value}-03-31`
    let eligibleCount = 0

    const markedWorkdays = Array.from(markedDays.value)
      .filter((dateStr) => {
        const date = new Date(dateStr + 'T00:00:00')
        return !isWeekend(date) && !holidays.value.has(dateStr) && dateStr <= maxCarryOverDate
      })
      .sort((a, b) => a.localeCompare(b))

    for (const _dateStr of markedWorkdays) {
      if (eligibleCount >= carryOverLimit) break
      eligibleCount++
    }

    return eligibleCount
  })

  const usedWorkDaysCurrentYear = computed(() => usedWorkDays.value - usedCarryOverDays.value)
  const remainingCarryOverDays = computed(() => Math.max(0, (carryOverDays?.value ?? 0) - usedCarryOverDays.value))
  const totalAvailableWorkDays = computed(() => maxVacationDays.value + (carryOverDays?.value ?? 0))

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

  const remainingDays = computed(() => totalAvailableWorkDays.value - usedWorkDays.value)
  const isOverBudget = computed(() => usedWorkDays.value > totalAvailableWorkDays.value)

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
      return { days: 0, startDate: null }
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
      startDate: bestBlock[0]
    }
  })

  return {
    usedWorkDays,
    usedWorkDaysCurrentYear,
    usedCarryOverDays,
    remainingCarryOverDays,
    remainingDays,
    isOverBudget,
    longestRestPeriod,
    totalSelectedDays
  }
}

