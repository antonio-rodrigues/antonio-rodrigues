<script setup lang="ts">
import { computed } from 'vue'
import { format } from 'date-fns'
import type { Day } from '../../composables/useCalendar'
import { useConfigStore } from '../../store/config'

const props = defineProps<{
  day: Day
}>()

const store = useConfigStore()
const dateStr = computed(() => format(props.day.date, 'yyyy-MM-dd'))
const isVacation = computed(() => store.markedDays.has(dateStr.value))

function handleClick() {
  if (!props.day.isWeekend && !props.day.isHoliday) {
    store.toggleVacationDay(dateStr.value)
  }
}
</script>

<template>
  <div
    class="flex items-center justify-center h-8 w-full rounded-sm text-sm transition-all duration-200"
    :class="[
      !day.isWeekend && !day.isHoliday ? 'cursor-pointer hover:bg-green-50 hover:scale-105 hover:shadow-sm z-10' : 'cursor-not-allowed',
      day.isHoliday && day.holidayType === 'national'
        ? 'bg-red-100 text-red-700'
        : day.isHoliday && day.holidayType === 'municipal'
          ? 'bg-orange-100 text-orange-700'
          : day.isWeekend
            ? 'bg-pink-50 text-pink-600'
            : isVacation
              ? 'bg-green-100 text-green-700'
              : 'bg-gray-50 text-gray-700'
    ]"
    :title="day.isHoliday
      ? day.holidayType === 'national'
        ? `${day.holidayName} · Feriado Nacional`
        : `${day.holidayName} · Feriado Municipal (${day.holidayMunicipalityName})`
      : undefined"
    @click="handleClick"
  >
    {{ day.dayOfMonth }}
  </div>
</template>
