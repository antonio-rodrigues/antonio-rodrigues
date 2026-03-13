<script setup lang="ts">
import type { Month as MonthType } from '../../composables/useCalendar'
import DayCell from './DayCell.vue'

defineProps<{
  month: MonthType
}>()

const dayInitials = ['S', 'T', 'Q', 'Q', 'S', 'S', 'D']
</script>

<template>
  <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
    <h3 class="text-lg font-bold text-gray-800 uppercase mb-4 text-center">
      <span class="text-gray-300 mr-2">{{ String((month.index ?? 0) + 1).padStart(2, '0') }}</span>
      {{ month.name }}
    </h3>
    
    <div class="grid grid-cols-7 gap-1">
      <!-- Day Headers -->
      <div 
        v-for="(initial, index) in dayInitials" 
        :key="index"
        class="text-xs font-semibold text-gray-400 text-center pb-2"
      >
        {{ initial }}
      </div>

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
