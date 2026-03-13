<script setup lang="ts">
import { computed } from 'vue'
import { AlertTriangle } from 'lucide-vue-next'
import { formatVacationSummary } from '../utils/holiday-utils'

const props = defineProps<{
  usedWorkDays: number
  totalSelectedDays: number
  remainingDays: number
  isOverBudget: boolean
  longestRestPeriod: number
  maxVacationDays: number
  markedDays: string[]
}>()

const emit = defineEmits<{
  (e: 'update:max-vacation-days', value: number): void
}>()

const summary = computed(() => formatVacationSummary(props.markedDays))

function onUpdateMaxDays(event: Event) {
  const target = event.target as HTMLInputElement
  const val = parseInt(target.value, 10)
  if (!isNaN(val)) {
    emit('update:max-vacation-days', val)
  }
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 mb-6 space-y-4">
    <!-- Alert Banner -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform -translate-y-2 opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform -translate-y-2 opacity-0"
    >
      <div v-if="isOverBudget" class="bg-red-50 text-red-700 border border-red-200 rounded-lg p-3 flex items-center gap-3">
        <AlertTriangle class="w-5 h-5 flex-shrink-0" />
        <span class="font-medium text-sm">Excedeu o seu saldo de férias!</span>
      </div>
    </Transition>

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-4">
      <!-- Stats Panel -->
      <div class="lg:col-span-3 bg-white rounded-lg shadow-sm border border-gray-100 p-4 flex flex-wrap gap-6 justify-around items-center">
        <!-- Stat: Saldo de Férias -->
        <div class="flex flex-col items-center">
          <label class="text-xs text-gray-500 uppercase tracking-wide cursor-pointer" for="max-days-input">Saldo de Férias</label>
          <input
            id="max-days-input"
            type="number"
            :value="maxVacationDays"
            min="0"
            class="text-2xl font-bold text-gray-900 w-16 text-center focus:outline-none focus:ring-2 focus:ring-blue-500 rounded transition-all duration-300"
            @input="onUpdateMaxDays"
          />
          <span class="text-xs text-gray-400">dias totais</span>
        </div>
        <!-- Stat: Dias Usados -->
        <div class="flex flex-col items-center">
          <span class="text-xs text-gray-500 uppercase tracking-wide">Dias Usados</span>
          <span class="text-2xl font-bold text-gray-900 transition-all duration-300">{{ usedWorkDays }}</span>
          <span class="text-xs text-gray-400">dias úteis</span>
        </div>
        <!-- Stat: Dias Consecutivos -->
        <div class="flex flex-col items-center">
          <span class="text-xs text-gray-500 uppercase tracking-wide">Dias Consecutivos</span>
          <span class="text-2xl font-bold text-gray-900 transition-all duration-300">{{ totalSelectedDays }}</span>
          <span class="text-xs text-gray-400">dias totais</span>
        </div>
        <!-- Stat: Dias Restantes -->
        <div class="flex flex-col items-center">
          <span class="text-xs text-gray-500 uppercase tracking-wide">Dias Restantes</span>
          <span
            class="text-2xl font-bold transition-all duration-300"
            :class="isOverBudget ? 'text-red-600' : 'text-gray-900'"
            data-testid="remaining-days"
          >
            {{ remainingDays }}
          </span>
          <span class="text-xs text-gray-400">dias úteis</span>
        </div>
        <!-- Stat: Maior Período de Descanso -->
        <div class="flex flex-col items-center">
          <span class="text-xs text-gray-500 uppercase tracking-wide">Maior Período de Descanso</span>
          <span class="text-2xl font-bold text-gray-900 transition-all duration-300">{{ longestRestPeriod }}</span>
          <span class="text-xs text-gray-400">dias consecutivos</span>
        </div>
      </div>

      <!-- Summary Panel -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-100 p-4 flex flex-col justify-center min-h-[100px]">
        <span class="text-xs text-gray-500 uppercase tracking-wide mb-2 block text-center lg:text-left">Dias Selecionados</span>
        <p class="text-sm font-medium text-gray-700 leading-relaxed break-words" data-testid="vacation-summary">
          {{ summary }}
        </p>
      </div>
    </div>
  </div>
</template>
