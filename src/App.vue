<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { watch } from 'vue'
import { useI18n } from 'vue-i18n'
import YearGrid from './components/calendar/YearGrid.vue'
import MunicipalitySelector from './components/MunicipalitySelector.vue'
import DashboardSidebar from './components/DashboardSidebar.vue'
import { useVacationStats } from './composables/useVacationStats'
import { useHolidays } from './composables/useHolidays'
import { useConfigStore } from './store/config'

const { t } = useI18n()
const store = useConfigStore()
const { year, markedDays, maxVacationDays, theme, locale } = storeToRefs(store)

// Apply theme class to html element
watch(theme, (newTheme) => {
  const root = document.documentElement
  const appElement = document.getElementById('app')
  
  if (newTheme === 'dark') {
    root.classList.add('dark')
    appElement?.classList.add('dark')
  } else {
    root.classList.remove('dark')
    appElement?.classList.remove('dark')
  }
}, { immediate: true })

const { holidays, error: holidayError } = useHolidays()
const { usedWorkDays, remainingDays, isOverBudget, longestRestPeriod, totalSelectedDays } = useVacationStats(
  year,
  markedDays,
  holidays,
  maxVacationDays
)

const confirmClear = () => {
  if (window.confirm(t('app.confirmClear'))) {
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

  const confirmed = window.confirm(t('app.confirmYearChange'))
  if (confirmed) {
    const exists = await store.checkHolidaysExist(newYear)
    if (exists) {
      store.clearMarkedDays()
      year.value = newYear
    } else {
      alert(t('app.noHolidayData', { year: newYear }))
      target.value = year.value.toString()
    }
  } else {
    target.value = year.value.toString()
  }
}

const handleLocaleChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  store.setLocale(target.value as 'pt' | 'en')
}
</script>

<template>
  <div class="min-h-screen bg-slate-50/50 dark:bg-slate-900/50 transition-colors duration-300">
    <!-- Holiday Error Banner -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform -translate-y-full opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform -translate-y-full opacity-0"
    >
      <div v-if="holidayError" class="bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-b border-amber-200 dark:border-amber-800 p-2 text-center text-xs font-medium sticky top-0 z-[60] backdrop-blur-md">
        {{ t(holidayError) }}
      </div>
    </Transition>

    <div class="sticky top-0 z-50 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 shadow-sm pt-8 pb-4 mb-8">
      <header class="max-w-7xl mx-auto px-4 mb-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div class="flex items-center gap-3 sm:gap-4">
            <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 flex-shrink-0">{{ t('app.title') }}</h1>
            <input
              type="number"
              :value="year"
              min="1900"
              max="9999"
              class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 w-20 sm:w-24 text-center border border-gray-200 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              @change="handleYearChange"
            />
          </div>
          <div class="w-full sm:max-w-md sm:ml-auto flex items-center gap-3">
            <button
              @click="confirmClear"
              class="whitespace-nowrap px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              {{ t('app.clearAll') }}
            </button>
            <div class="flex-grow">
              <MunicipalitySelector />
            </div>
            
            <!-- Language Selector -->
            <select
              :value="locale"
              @change="handleLocaleChange"
              class="p-2 text-sm font-medium text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors appearance-none cursor-pointer px-3"
            >
              <option value="pt">PT</option>
              <option value="en">EN</option>
            </select>

            <button
              @click="store.toggleTheme"
              class="p-2 text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 transition-colors flex items-center justify-center"
              :title="theme === 'light' ? t('app.darkMode') : t('app.lightMode')"
            >
              <span class="material-symbols-outlined">
                {{ theme === 'light' ? 'dark_mode' : 'light_mode' }}
              </span>
            </button>
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
