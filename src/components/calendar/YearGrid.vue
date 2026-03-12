<script setup lang="ts">
import { computed } from 'vue'
import { format } from 'date-fns'
import { useCalendar } from '../../composables/useCalendar'
import { useHolidays } from '../../composables/useHolidays'
import { useConfigStore } from '../../store/config'
import MonthCard from './MonthCard.vue'

const { getYearData } = useCalendar()
const { holidays } = useHolidays()
const configStore = useConfigStore()

const enrichedMonths = computed(() => {
  const months = getYearData(configStore.year)
  return months.map(month => ({
    ...month,
    days: month.days.map(day => {
      const dateStr = format(day.date, 'yyyy-MM-dd')
      const holiday = holidays.value.get(dateStr)
      if (holiday) {
        return {
          ...day,
          isHoliday: true,
          holidayName: holiday.name,
          holidayType: holiday.type,
          holidayMunicipalityName: holiday.municipalityName
        }
      }
      return day
    })
  }))
})
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4 md:p-8">
    <MonthCard
      v-for="month in enrichedMonths"
      :key="month.name"
      :month="month"
    />
  </div>
</template>
