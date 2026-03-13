<script setup lang="ts">
import { storeToRefs } from 'pinia'
import YearGrid from './components/calendar/YearGrid.vue'
import MunicipalitySelector from './components/MunicipalitySelector.vue'
import DashboardSidebar from './components/DashboardSidebar.vue'
import { useVacationStats } from './composables/useVacationStats'
import { useHolidays } from './composables/useHolidays'
import { useConfigStore } from './store/config'

const store = useConfigStore()
const { year, markedDays, maxVacationDays } = storeToRefs(store)
const { holidays } = useHolidays()
const { usedWorkDays, remainingDays, isOverBudget, longestRestPeriod } = useVacationStats(
  year,
  markedDays,
  holidays,
  maxVacationDays
)
</script>

<template>
  <div class="min-h-screen bg-slate-50 py-8">
    <header class="max-w-7xl mx-auto px-4 mb-8">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 class="text-3xl font-bold text-gray-900 flex-shrink-0">Planeador de Férias</h1>
        <div class="w-full sm:max-w-xs sm:ml-auto">
          <MunicipalitySelector />
        </div>
      </div>
    </header>

    <DashboardSidebar
      :used-work-days="usedWorkDays"
      :remaining-days="remainingDays"
      :is-over-budget="isOverBudget"
      :longest-rest-period="longestRestPeriod"
      :max-vacation-days="store.maxVacationDays"
      :marked-days="Array.from(markedDays)"
      @update:max-vacation-days="store.maxVacationDays = $event"
    />

    <main class="max-w-7xl mx-auto">
      <YearGrid />
    </main>
  </div>
</template>

<style scoped>
</style>
