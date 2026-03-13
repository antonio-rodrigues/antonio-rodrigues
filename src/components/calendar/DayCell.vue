<script setup lang="ts">
import { computed } from 'vue'
import { format } from 'date-fns'
import { useI18n } from 'vue-i18n'
import type { Day } from '../../composables/useCalendar'
import { useConfigStore } from '../../store/config'

const { t } = useI18n()
const props = defineProps<{
  day: Day
}>()

const store = useConfigStore()
const dateStr = computed(() => format(props.day.date, 'yyyy-MM-dd'))
const isVacation = computed(() => store.markedDays.has(dateStr.value))

let touchTimeout: ReturnType<typeof setTimeout> | null = null

function handleClick() {
  if (!props.day.isWeekend && !props.day.isHoliday) {
    store.toggleVacationDay(dateStr.value)
  }
}

function handleMouseEnter() {
  if (props.day.isHoliday) {
    store.hoveredHoliday = {
      date: dateStr.value,
      name: props.day.holidayName || '',
      type: props.day.holidayType || 'national',
      municipalityName: props.day.holidayMunicipalityName
    }
  }
}

function handleMouseLeave() {
  if (props.day.isHoliday) {
    store.hoveredHoliday = null
  }
}

function handleTouchStart() {
  if (props.day.isHoliday) {
    handleMouseEnter()
    if (touchTimeout) clearTimeout(touchTimeout)
    touchTimeout = setTimeout(() => {
      if (store.hoveredHoliday?.date === dateStr.value) {
        store.hoveredHoliday = null
      }
      touchTimeout = null
    }, 3000)
  }
}

const title = computed(() => {
  if (!props.day.isHoliday) return undefined
  
  const holidayName = t(props.day.holidayName || '')
  if (props.day.holidayType === 'national') {
    return `${holidayName} · ${t('calendar.nationalHoliday')}`
  } else {
    return `${holidayName} · ${t('calendar.municipalHoliday')} (${props.day.holidayMunicipalityName})`
  }
})
</script>

<template>
  <div
    class="flex items-center justify-center h-8 w-full rounded-sm text-sm transition-all duration-200"
    :class="[
      !day.isWeekend && !day.isHoliday ? 'cursor-pointer hover:bg-green-50 dark:hover:bg-green-900/30 hover:scale-105 hover:shadow-sm z-10' : 'cursor-not-allowed',
      day.isHoliday && day.holidayType === 'national'
        ? 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300'
        : day.isHoliday && day.holidayType === 'municipal'
          ? 'bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300'
          : day.isWeekend
            ? 'bg-pink-50 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400'
            : isVacation
              ? 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300'
              : 'bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-400'
    ]"
    :title="title"
    @click="handleClick"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @touchstart="handleTouchStart"
  >
    {{ day.dayOfMonth }}
  </div>
</template>
