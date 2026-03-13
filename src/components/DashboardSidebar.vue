<script setup lang="ts">
import { AlertTriangle } from 'lucide-vue-next'

defineProps<{
  usedWorkDays: number
  remainingDays: number
  isOverBudget: boolean
  longestRestPeriod: number
  maxVacationDays: number
}>()
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 mb-6">
    <!-- Alert Banner -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform -translate-y-2 opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform -translate-y-2 opacity-0"
    >
      <div v-if="isOverBudget" class="bg-red-50 text-red-700 border border-red-200 rounded-lg p-3 mb-4 flex items-center gap-3">
        <AlertTriangle class="w-5 h-5 flex-shrink-0" />
        <span class="font-medium text-sm">Excedeu o seu saldo de férias!</span>
      </div>
    </Transition>

    <div class="bg-white rounded-lg shadow-sm border border-gray-100 p-4 flex flex-wrap gap-6 justify-around items-center">
      <!-- Stat: Saldo de Férias -->
      <div class="flex flex-col items-center">
        <span class="text-xs text-gray-500 uppercase tracking-wide">Saldo de Férias</span>
        <span class="text-2xl font-bold text-gray-900 transition-all duration-300">{{ maxVacationDays }}</span>
        <span class="text-xs text-gray-400">dias totais</span>
      </div>
      <!-- Stat: Dias Usados -->
      <div class="flex flex-col items-center">
        <span class="text-xs text-gray-500 uppercase tracking-wide">Dias Usados</span>
        <span class="text-2xl font-bold text-gray-900 transition-all duration-300">{{ usedWorkDays }}</span>
        <span class="text-xs text-gray-400">dias úteis</span>
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
  </div>
</template>
