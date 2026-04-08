<script setup lang="ts">
withDefaults(defineProps<{
  open: boolean
  message: string
  type?: 'success' | 'error' | 'info'
}>(), {
  type: 'info'
})
</script>

<template>
  <Transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="opacity-0 translate-y-2"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition duration-150 ease-in"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 translate-y-2"
  >
    <div
      v-if="open"
      class="fixed right-4 top-4 z-[140] max-w-sm rounded-lg border px-3 py-2 text-sm font-medium shadow-lg backdrop-blur-sm"
      :class="[
        type === 'success'
          ? 'border-emerald-200 bg-emerald-50/95 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-900/70 dark:text-emerald-200'
          : type === 'error'
            ? 'border-red-200 bg-red-50/95 text-red-800 dark:border-red-800 dark:bg-red-900/70 dark:text-red-200'
            : 'border-sky-200 bg-sky-50/95 text-sky-800 dark:border-sky-800 dark:bg-sky-900/70 dark:text-sky-200'
      ]"
      role="status"
      aria-live="polite"
    >
      {{ message }}
    </div>
  </Transition>
</template>
