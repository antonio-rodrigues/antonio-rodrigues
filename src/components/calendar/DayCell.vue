<script setup lang="ts">
import type { Day } from '../../composables/useCalendar'

defineProps<{
  day: Day
}>()
</script>

<template>
  <div
    class="flex items-center justify-center h-8 w-full rounded-sm text-sm cursor-pointer hover:bg-gray-200 transition-colors"
    :class="[
      day.isHoliday && day.holidayType === 'national'
        ? 'bg-red-100 text-red-700'
        : day.isHoliday && day.holidayType === 'municipal'
          ? 'bg-orange-100 text-orange-700'
          : day.isWeekend
            ? 'bg-pink-50 text-pink-600'
            : 'bg-gray-50 text-gray-700'
    ]"
    :title="day.isHoliday
      ? day.holidayType === 'national'
        ? `${day.holidayName} · Feriado Nacional`
        : `${day.holidayName} · Feriado Municipal (${day.holidayMunicipalityName})`
      : undefined"
  >
    {{ day.dayOfMonth }}
  </div>
</template>
