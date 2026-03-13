<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Month as MonthType } from '../../composables/useCalendar'
import DayCell from './DayCell.vue'

const { tm, t } = useI18n()

defineProps<{
  month: MonthType
}>()

const dayInitials = computed(() => tm('calendar.dayInitials') as string[])
</script>

<template>
  <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
    <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100 uppercase mb-4 text-center">
      <span class="text-gray-300 dark:text-gray-600 mr-2">{{ String(month.index + 1).padStart(2, '0') }}</span>
      {{ t(`calendar.fullMonths.${month.index}`) }}
    </h3>

    <div class="grid grid-cols-7 gap-1">
      <!-- Day Headers -->
      <div 
        v-for="(initial, index) in dayInitials" 
        :key="index"
        class="text-xs font-semibold text-gray-400 dark:text-gray-500 text-center pb-2"
      >
        {{ initial }}
      </div>
...

      <!-- Empty leading cells -->
      <div 
        v-for="i in month.firstDayOffset" 
        :key="`empty-${i}`" 
        class="h-8"
      ></div>

      <!-- Days -->
      <DayCell 
        v-for="day in month.days" 
        :key="day.date.toISOString()" 
        :day="day"
      />
    </div>
  </div>
</template>
