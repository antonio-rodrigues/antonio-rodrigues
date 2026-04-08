<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import YearGrid from './components/calendar/YearGrid.vue'
import MunicipalitySelector from './components/MunicipalitySelector.vue'
import DashboardSidebar from './components/DashboardSidebar.vue'
import ExportControls from './components/ExportControls.vue'
import ConfirmDialog from './components/ui/ConfirmDialog.vue'
import ToastMessage from './components/ui/ToastMessage.vue'
import { useVacationStats } from './composables/useVacationStats'
import { useHolidays } from './composables/useHolidays'
import { useConfigStore } from './store/config'

const { t } = useI18n()
const store = useConfigStore()
const { year, markedDays, maxVacationDays, carryOverDays, theme, locale } = storeToRefs(store)
const currentYear = new Date().getFullYear()
const isMobileStatsOpen = ref(false)
const pendingYear = ref<number | null>(null)
const confirmAction = ref<'clear' | 'year-change' | null>(null)
const confirmOpen = ref(false)
const confirmTitle = ref('')
const confirmMessage = ref('')
const confirmDanger = ref(false)
const toastOpen = ref(false)
const toastMessage = ref('')
const toastType = ref<'success' | 'error' | 'info'>('info')
let toastTimer: ReturnType<typeof setTimeout> | null = null

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

watch([locale, year], () => {
  const htmlLang = locale.value === 'en' ? 'en-GB' : 'pt-PT'
  document.documentElement.lang = htmlLang
  document.title = t('app.pageTitle', { year: year.value })

  const metaDescription = document.querySelector('meta[name="description"]')
  if (metaDescription) {
    metaDescription.setAttribute('content', t('app.pageDescription', { year: year.value }))
  }
}, { immediate: true })

const { holidays, error: holidayError } = useHolidays()
const {
  usedWorkDays,
  remainingDays,
  isOverBudget,
  longestRestPeriod,
  totalSelectedDays
} = useVacationStats(
  year,
  markedDays,
  holidays,
  maxVacationDays,
  carryOverDays
)

const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
  toastMessage.value = message
  toastType.value = type
  toastOpen.value = true

  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    toastOpen.value = false
    toastMessage.value = ''
  }, 2600)
}

const openConfirm = (action: 'clear' | 'year-change') => {
  confirmAction.value = action
  confirmOpen.value = true

  if (action === 'clear') {
    confirmTitle.value = t('app.confirmClearTitle')
    confirmMessage.value = t('app.confirmClear')
    confirmDanger.value = true
    return
  }

  confirmTitle.value = t('app.confirmYearChangeTitle')
  confirmMessage.value = t('app.confirmYearChange')
  confirmDanger.value = false
}

const closeConfirm = () => {
  confirmOpen.value = false
  confirmAction.value = null
  pendingYear.value = null
}

const handleConfirmAction = async () => {
  if (!confirmAction.value) return

  if (confirmAction.value === 'clear') {
    store.clearMarkedDays()
    showToast(t('app.clearedToast'), 'success')
    closeConfirm()
    return
  }

  const targetYear = pendingYear.value
  if (!targetYear) {
    closeConfirm()
    return
  }

  const exists = await store.checkHolidaysExist(targetYear)
  if (exists) {
    store.clearMarkedDays()
    year.value = targetYear
    showToast(t('app.yearUpdatedToast', { year: targetYear }), 'success')
  } else {
    showToast(t('app.noHolidayData', { year: targetYear }), 'error')
  }

  closeConfirm()
}

const confirmClear = () => {
  openConfirm('clear')
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

  pendingYear.value = newYear
  target.value = year.value.toString()
  openConfirm('year-change')
}

const handleLocaleChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  store.setLocale(target.value as 'pt' | 'en')
}
</script>

<template>
  <div class="min-h-screen bg-slate-50/50 dark:bg-slate-900/50 transition-colors duration-300">
    <ToastMessage :open="toastOpen" :message="toastMessage" :type="toastType" />

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

    <header class="sticky top-0 z-50 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 shadow-sm pt-4 pb-3 mb-4">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div class="flex items-center gap-3 sm:gap-4">
            <h1 class="text-xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 flex-shrink-0">{{ t('app.title') }}</h1>
            <input
              type="number"
              :value="year"
              min="1900"
              max="9999"
              class="text-lg sm:text-2xl font-bold text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 w-16 sm:w-24 text-center border border-gray-200 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              @change="handleYearChange"
              aria-label="Selecionar Ano"
            />
          </div>
          <div class="w-full sm:max-w-2xl sm:ml-auto flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-3">
            <button
              @click="confirmClear"
              class="whitespace-nowrap px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              {{ t('app.clearAll') }}
            </button>
            <div class="basis-full sm:basis-auto sm:flex-1 order-last sm:order-none">
              <MunicipalitySelector />
            </div>
            
            <ExportControls />

            <!-- Language Selector -->
            <select
              :value="locale"
              @change="handleLocaleChange"
              class="p-2 text-sm font-medium text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors appearance-none cursor-pointer px-3"
              aria-label="Selecionar Idioma"
            >
              <option value="pt">PT</option>
              <option value="en">EN</option>
            </select>

            <button
              @click="store.toggleTheme"
              class="py-[6px] px-2 text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 transition-colors flex items-center justify-center"
              :title="theme === 'light' ? t('app.darkMode') : t('app.lightMode')"
              :aria-label="theme === 'light' ? t('app.darkMode') : t('app.lightMode')"
            >
              <span class="material-symbols-outlined">
                {{ theme === 'light' ? 'dark_mode' : 'light_mode' }}
              </span>
            </button>

            <button
              type="button"
              class="lg:hidden whitespace-nowrap px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              :aria-expanded="isMobileStatsOpen.toString()"
              @click="isMobileStatsOpen = !isMobileStatsOpen"
            >
              {{ isMobileStatsOpen ? t('app.hideStats') : t('app.showStats') }}
            </button>
          </div>
        </div>
      </div>
    </header>

    <section aria-label="Estatísticas e Dashboard" class="max-w-7xl mx-auto px-4 mb-4">
      <div :class="[isMobileStatsOpen ? 'block' : 'hidden', 'lg:block']">
        <DashboardSidebar
          :used-work-days="usedWorkDays"
          :total-selected-days="totalSelectedDays"
          :remaining-days="remainingDays"
          :is-over-budget="isOverBudget"
          :longest-rest-period="longestRestPeriod"
          :max-vacation-days="store.maxVacationDays"
          :carry-over-days="store.carryOverDays"
          :marked-days="Array.from(markedDays)"
          @update:max-vacation-days="store.maxVacationDays = $event"
          @update:carry-over-days="store.carryOverDays = $event"
        />
      </div>
    </section>

    <main class="max-w-7xl mx-auto pb-12">
      <section aria-label="Calendário Anual" id="year-grid-container">
        <div class="px-4 md:px-8 mb-2">
          <h2 class="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-2">{{ t('calendar.legend.title') }}</h2>
          <ul class="flex flex-wrap gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
            <li class="inline-flex items-center gap-2 rounded-full border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 px-3 py-1">
              <span class="h-3 w-3 rounded-sm bg-green-200 dark:bg-green-900/50 border border-gray-500"></span>
              {{ t('calendar.legend.vacation') }}
            </li>
            <li class="inline-flex items-center gap-2 rounded-full border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 px-3 py-1">
              <span class="h-3 w-3 rounded-sm bg-amber-200 dark:bg-amber-800/60 border border-gray-500"></span>
              {{ t('calendar.legend.carryOverVacation') }}
            </li>
            <li class="inline-flex items-center gap-2 rounded-full border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 px-3 py-1">
              <span class="h-3 w-3 rounded-sm bg-red-100 dark:bg-red-900/40"></span>
              {{ t('calendar.legend.nationalHoliday') }}
            </li>
            <li class="inline-flex items-center gap-2 rounded-full border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 px-3 py-1">
              <span class="h-3 w-3 rounded-sm bg-orange-100 dark:bg-orange-900/40"></span>
              {{ t('calendar.legend.municipalHoliday') }}
            </li>
            <li class="inline-flex items-center gap-2 rounded-full border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 px-3 py-1">
              <span class="h-3 w-3 rounded-sm bg-pink-50 dark:bg-pink-900/30"></span>
              {{ t('calendar.legend.weekend') }}
            </li>
          </ul>
        </div>
        <YearGrid />
      </section>
    </main>

    <footer class="max-w-7xl mx-auto px-4 py-8 border-t border-gray-100 dark:border-gray-800 text-center text-gray-500 dark:text-gray-400 text-sm">
      <p>&copy; {{ currentYear }} {{ t('app.footerBrand') }}. {{ t('app.footerRights') }}</p>
      <p class="mt-1">{{ t('app.footerTagline') }}</p>
    </footer>

    <ConfirmDialog
      :open="confirmOpen"
      :title="confirmTitle"
      :message="confirmMessage"
      :confirm-label="t('common.confirm')"
      :cancel-label="t('common.cancel')"
      :danger="confirmDanger"
      @confirm="handleConfirmAction"
      @cancel="closeConfirm"
    />
  </div>
</template>

<style scoped>
</style>
