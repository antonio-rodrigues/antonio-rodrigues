import { describe, it } from 'vitest'

describe('useVacationStats', () => {
  it.todo('usedWorkDays excludes weekends')
  it.todo('usedWorkDays excludes holidays')
  it.todo('remainingDays = max - used')
  it.todo('isOverBudget when used > max')
  it.todo('longestRestPeriod counts vacation+weekend+holiday runs')
  it.todo('longestRestPeriod resets at workday')
})
