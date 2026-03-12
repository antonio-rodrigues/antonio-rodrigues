<script setup lang="ts">
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
    <div class="bg-white rounded-lg shadow-sm border border-gray-100 p-4 flex flex-wrap gap-6 justify-around">
      <!-- Stat: Saldo de Férias -->
      <div class="flex flex-col items-center">
        <span class="text-xs text-gray-500 uppercase tracking-wide">Saldo de Férias</span>
        <span class="text-2xl font-bold text-gray-900">{{ maxVacationDays }}</span>
        <span class="text-xs text-gray-400">dias totais</span>
      </div>
      <!-- Stat: Dias Usados -->
      <div class="flex flex-col items-center">
        <span class="text-xs text-gray-500 uppercase tracking-wide">Dias Usados</span>
        <span class="text-2xl font-bold text-gray-900">{{ usedWorkDays }}</span>
        <span class="text-xs text-gray-400">dias úteis</span>
      </div>
      <!-- Stat: Dias Restantes -->
      <div class="flex flex-col items-center">
        <span class="text-xs text-gray-500 uppercase tracking-wide">Dias Restantes</span>
        <span
          class="text-2xl font-bold"
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
        <span class="text-2xl font-bold text-gray-900">{{ longestRestPeriod }}</span>
        <span class="text-xs text-gray-400">dias consecutivos</span>
      </div>
    </div>
  </div>
</template>
