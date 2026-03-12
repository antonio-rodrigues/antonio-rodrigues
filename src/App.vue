<script setup lang="ts">
import { Calendar } from 'lucide-vue-next'
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
    <div class="flex items-center gap-2 mb-4">
      <Calendar class="w-8 h-8 text-blue-500" />
      <h1 class="text-3xl font-bold">PT Holiday Calendar 2026</h1>
    </div>
    <p class="text-slate-500 dark:text-slate-400">
      Project initialized successfully. Data models and configuration store are being set up.
    </p>
  </div>
</template>

<style scoped>
</style>
