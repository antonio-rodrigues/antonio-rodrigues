<script setup lang="ts">
import { computed } from 'vue'
import { format } from 'date-fns'
import { useI18n } from 'vue-i18n'
import type { Day } from '../../composables/useCalendar'
import type { HolidayEntry } from '../../store/config'
import { useConfigStore } from '../../store/config'

const { t, locale } = useI18n()
const props = defineProps<{
  day: Day
}>()

const store = useConfigStore()
const dateStr = computed(() => format(props.day.date, 'yyyy-MM-dd'))
const isVacation = computed(() => store.markedDays.has(dateStr.value))
const isToggleable = computed(() => !props.day.isWeekend && !props.day.isHoliday)

const localizedDateLabel = computed(() => {
  const localeCode = locale.value === 'en' ? 'en-GB' : 'pt-PT'
  return props.day.date.toLocaleDateString(localeCode, {
    weekday: 'short',
    day: '2-digit',
    month: 'short'
  })
})

const dayStateLabel = computed(() => {
  if (props.day.isHoliday) {
    return props.day.holidayType === 'municipal'
      ? t('calendar.dayStates.municipalHoliday')
      : t('calendar.dayStates.nationalHoliday')
  }
  if (props.day.isWeekend) return t('calendar.dayStates.weekend')
  if (isCarryOverVacation.value) return t('calendar.dayStates.carryOverVacation')
  if (isVacation.value) return t('calendar.dayStates.vacation')
  return t('calendar.dayStates.available')
})

const ariaLabel = computed(() => `${localizedDateLabel.value}: ${dayStateLabel.value}`)

function resolveHolidayName(name?: string): string {
  if (!name) return ''
  return name.includes('.') ? t(name) : name
}

const isCarryOverVacation = computed(() => {
  if (!isVacation.value) return false
  if (store.carryOverDays <= 0) return false
  if (props.day.isWeekend || props.day.isHoliday) return false

  const maxCarryOverDate = `${store.year}-03-31`
  if (dateStr.value > maxCarryOverDate) return false

  const eligibleMarkedWorkdays = Array.from(store.markedDays)
    .filter((markedDate) => {
      const date = new Date(markedDate + 'T00:00:00')
      return !isNaN(date.getTime()) && !store.nationalHolidays.has(markedDate) && date.getDay() !== 0 && date.getDay() !== 6 && markedDate <= maxCarryOverDate
    })
    .sort((a, b) => a.localeCompare(b))

  return eligibleMarkedWorkdays.slice(0, Math.max(0, store.carryOverDays)).includes(dateStr.value)
})

function getHolidayEntry(): HolidayEntry | null {
  if (!props.day.isHoliday) return null
  return {
    date: dateStr.value,
    name: props.day.holidayName || '',
    type: props.day.holidayType || 'national',
    municipalityName: props.day.holidayMunicipalityName
  }
}

function handleActivate() {
  if (props.day.isHoliday) {
    store.selectedHoliday = getHolidayEntry()
    return
  }
  if (props.day.isWeekend) {
    store.selectedHoliday = null
    return
  }

  store.toggleVacationDay(dateStr.value)
  store.selectedHoliday = null
}

function handleMouseEnter() {
  store.hoveredHoliday = getHolidayEntry()
}

function handleMouseLeave() {
  if (props.day.isHoliday && store.hoveredHoliday?.date === dateStr.value) {
    store.hoveredHoliday = null
  }
}

const title = computed(() => {
  if (!props.day.isHoliday) return undefined
  
  const holidayName = resolveHolidayName(props.day.holidayName)
  if (props.day.holidayType === 'national') {
    return `${holidayName} · ${t('calendar.nationalHoliday')}`
  } else {
    return `${holidayName} · ${t('calendar.municipalHoliday')} (${props.day.holidayMunicipalityName})`
  }
})
</script>

<template>
  <button
    type="button"
    class="flex items-center justify-center h-8 w-full rounded-sm text-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-1 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-800"
    :class="[
      !day.isWeekend && !day.isHoliday
        ? 'cursor-pointer hover:bg-green-50 dark:hover:bg-green-900/30 hover:scale-105 hover:shadow-sm z-10'
        : day.isHoliday
          ? 'cursor-help'
          : 'cursor-default',
      day.isHoliday && day.holidayType === 'national'
        ? 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300'
        : day.isHoliday && day.holidayType === 'municipal'
          ? 'bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300'
          : day.isWeekend
            ? 'bg-pink-50 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400'
            : isCarryOverVacation
              ? 'bg-amber-200 dark:bg-amber-800/60 text-amber-900 dark:text-amber-100 border border-gray-500'
              : isVacation
              ? 'bg-green-200 dark:bg-green-900/50 text-green-700 dark:text-green-300 border border-gray-500'
              : 'bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-400'
    ]"
    :aria-label="ariaLabel"
    :aria-disabled="(!isToggleable).toString()"
    :aria-pressed="isToggleable ? isVacation.toString() : undefined"
    :title="title"
    @click="handleActivate"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    {{ day.dayOfMonth }}
  </button>
</template>
