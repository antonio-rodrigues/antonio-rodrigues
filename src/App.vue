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
const { usedWorkDays, remainingDays, isOverBudget, longestRestPeriod, totalSelectedDays } = useVacationStats(
  year,
  markedDays,
  holidays,
  maxVacationDays
)

const confirmClear = () => {
  if (window.confirm('Confirma?')) {
    store.clearMarkedDays()
  }
}

const handleYearChange = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const newYear = parseInt(target.value, 10)
  
  // Validation: 4 digits, >= 1900
  if (isNaN(newYear) || newYear < 1900 || newYear > 9999 || target.value.length !== 4) {
    target.value = year.value.toString()
    return
  }

  if (newYear === year.value) return

  const confirmed = window.confirm('Todas as seleções actuais serão descartadas. Confirma? (SIM / NÃO)')
  if (confirmed) {
    const exists = await store.checkHolidaysExist(newYear)
    if (exists) {
      store.clearMarkedDays()
      year.value = newYear
    } else {
      alert(`Não foram encontrados dados de feriados para o ano ${newYear}.`)
      target.value = year.value.toString()
    }
  } else {
    target.value = year.value.toString()
  }
}
</script>

<template>
  <div class="min-h-screen bg-slate-50">
    <div class="sticky top-0 z-50 bg-slate-50/80 backdrop-blur-md border-b border-gray-100 shadow-sm pt-8 pb-4 mb-8">
      <header class="max-w-7xl mx-auto px-4 mb-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div class="flex items-center gap-3 sm:gap-4">
            <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 flex-shrink-0">Planeador de Férias</h1>
            <input
              type="number"
              :value="year"
              min="1900"
              max="9999"
              class="text-xl sm:text-2xl font-bold text-gray-900 w-20 sm:w-24 text-center border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              @change="handleYearChange"
            />
          </div>
          <div class="w-full sm:max-w-md sm:ml-auto flex items-center gap-3">
            <button
              @click="confirmClear"
              class="whitespace-nowrap px-3 py-2 text-sm font-medium text-gray-600 hover:text-red-600 border border-gray-300 rounded-md bg-white hover:bg-red-50 transition-colors"
            >
              Limpar tudo
            </button>
            <div class="flex-grow">
              <MunicipalitySelector />
            </div>
          </div>
        </div>
      </header>

      <DashboardSidebar
        :used-work-days="usedWorkDays"
        :total-selected-days="totalSelectedDays"
        :remaining-days="remainingDays"
        :is-over-budget="isOverBudget"
        :longest-rest-period="longestRestPeriod"
        :max-vacation-days="store.maxVacationDays"
        :marked-days="Array.from(markedDays)"
        @update:max-vacation-days="store.maxVacationDays = $event"
      />
    </div>

    <main class="max-w-7xl mx-auto pb-12">
      <YearGrid />
    </main>
  </div>
</template>

<style scoped>
</style>
