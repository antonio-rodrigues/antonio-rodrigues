<script setup lang="ts">
import YearGrid from './components/calendar/YearGrid.vue'
import MunicipalitySelector from './components/MunicipalitySelector.vue'
</script>

<template>
  <div class="min-h-screen bg-slate-50 py-8">
    <header class="max-w-7xl mx-auto px-4 mb-8">
      <div class="flex flex-col sm:flex-row sm:items-center gap-4">
        <h1 class="text-3xl font-bold text-gray-900 flex-shrink-0">Planeador de Férias</h1>
        <div class="w-full sm:max-w-xs">
          <MunicipalitySelector />
        </div>
      </div>
    </header>
    <main class="max-w-7xl mx-auto">
      <YearGrid />
    </main>
  </div>
</template>

<style scoped>
</style>
