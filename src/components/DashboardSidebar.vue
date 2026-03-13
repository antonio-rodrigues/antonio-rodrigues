<script setup lang="ts">
import { computed } from 'vue'
import { AlertTriangle } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import { formatVacationSummary } from '../utils/holiday-utils'

import type { RestPeriod } from '../composables/useVacationStats'

const { t } = useI18n()

const props = defineProps<{
  usedWorkDays: number
  totalSelectedDays: number
  remainingDays: number
  isOverBudget: boolean
  longestRestPeriod: RestPeriod
  maxVacationDays: number
  markedDays: string[]
}>()

const emit = defineEmits<{
  (e: 'update:max-vacation-days', value: number): void
}>()

const summary = computed(() => formatVacationSummary(props.markedDays, t))

function onUpdateMaxDays(event: Event) {
  const target = event.target as HTMLInputElement
  const val = parseInt(target.value, 10)
  if (!isNaN(val)) {
    emit('update:max-vacation-days', val)
  }
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 space-y-4">
    <!-- Alert Banner -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform -translate-y-2 opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform -translate-y-2 opacity-0"
    >
      <div v-if="isOverBudget" class="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-lg p-3 flex items-center gap-3">
        <AlertTriangle class="w-5 h-5 flex-shrink-0" />
        <span class="font-medium text-sm">{{ t('dashboard.overBudget') }}</span>
      </div>
    </Transition>

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-4">
      <!-- Stats Panel -->
      <div id="status-panel" class="lg:col-span-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-3 sm:p-4 flex flex-wrap gap-4 sm:gap-6 justify-around items-center transition-colors">
        <!-- Stat: Saldo de Férias -->
        <div class="flex flex-col items-center">
          <label class="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide cursor-pointer" for="max-days-input">{{ t('dashboard.vacationBalance') }}</label>
          <input
            id="max-days-input"
            type="number"
            :value="maxVacationDays"
            min="0"
            class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 w-12 sm:w-16 text-center border border-gray-200 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            @input="onUpdateMaxDays"
          />
          <span class="text-[10px] sm:text-xs text-gray-400 dark:text-gray-500">{{ t('dashboard.totalDays') }}</span>
        </div>
        <!-- Stat: Dias Usados -->
        <div class="flex flex-col items-center">
          <span class="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">{{ t('dashboard.daysUsed') }}</span>
          <span class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 transition-all duration-300">{{ usedWorkDays }}</span>
          <span class="text-[10px] sm:text-xs text-gray-400 dark:text-gray-500">{{ t('dashboard.workingDays') }}</span>
        </div>
        <!-- Stat: Dias Consecutivos -->
        <div class="flex flex-col items-center">
          <span class="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">{{ t('dashboard.consecutiveDays') }}</span>
          <span class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 transition-all duration-300">{{ totalSelectedDays }}</span>
          <span class="text-[10px] sm:text-xs text-gray-400 dark:text-gray-500">{{ t('dashboard.totalDays') }}</span>
        </div>
        <!-- Stat: Dias Restantes -->
        <div class="flex flex-col items-center">
          <span class="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">{{ t('dashboard.daysRemaining') }}</span>
          <span
            class="text-xl sm:text-2xl font-bold transition-all duration-300"
            :class="isOverBudget ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-gray-100'"
            data-testid="remaining-days"
          >
            {{ remainingDays }}
          </span>
          <span class="text-[10px] sm:text-xs text-gray-400 dark:text-gray-500">{{ t('dashboard.workingDays') }}</span>
        </div>
        <!-- Stat: Maior Período de Descanso -->
        <div class="flex flex-col items-center">
          <span class="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">{{ t('dashboard.longestRestPeriod') }}</span>
          <div class="flex items-baseline gap-1 sm:gap-2">
            <span class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 transition-all duration-300">{{ longestRestPeriod.days }}</span>
            <span v-if="longestRestPeriod.startDate" class="text-[10px] sm:text-sm font-medium text-gray-400 dark:text-gray-500">
              ({{ t(`calendar.months.${['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'][longestRestPeriod.startDate.getMonth()]}`) }} {{ String(longestRestPeriod.startDate.getDate()).padStart(2, '0') }})
            </span>
          </div>
          <span class="text-[10px] sm:text-xs text-gray-400 dark:text-gray-500">{{ t('dashboard.consecutiveWorkingDays') }}</span>
        </div>
      </div>

      <!-- Summary Panel -->
      <div id="status-panel" class="hidden lg:flex bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-4 flex-col justify-center min-h-[100px] transition-colors">
        <span class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2 block text-center lg:text-left">{{ t('dashboard.selectedDays') }}</span>
        <p class="text-sm font-medium text-gray-700 dark:text-gray-300 leading-relaxed break-words" data-testid="vacation-summary">
          {{ summary }}
        </p>
      </div>
    </div>
  </div>
</template>
