<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Download, Calendar, Image as ImageIcon, Database, Upload, Check, Loader2 } from 'lucide-vue-next'
import { exportToICS, exportToImage, exportToJSON, importFromJSON } from '../utils/export-utils'
import { useConfigStore } from '../store/config'

const { t } = useI18n()
const store = useConfigStore()
const isOpen = ref(false)
const isExportingImage = ref(false)
const showSuccess = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

const handleExportICS = () => {
  exportToICS(Array.from(store.markedDays), store.year, t)
  notifySuccess()
}

const handleExportImage = async () => {
  isExportingImage.value = true
  // We want to capture the whole YearGrid
  // The YearGrid is wrapped in a section with aria-label="Calendário Anual" in App.vue
  // We should give it an ID for better targeting
  await exportToImage('year-grid-container', `vacations_${store.year}.png`)
  isExportingImage.value = false
  notifySuccess()
}

const handleExportJSON = () => {
  const data = {
    markedDays: Array.from(store.markedDays),
    selectedMunicipalityId: store.selectedMunicipalityId,
    maxVacationDays: store.maxVacationDays,
    carryOverDays: store.carryOverDays,
    year: store.year,
    theme: store.theme,
    locale: store.locale
  }
  exportToJSON(data, `vacations_backup_${store.year}.json`)
  notifySuccess()
}

const triggerImport = () => {
  fileInput.value?.click()
}

const handleImportJSON = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  if (window.confirm(t('export.importConfirm'))) {
    try {
      const data = await importFromJSON(file)
      
      if (data.markedDays) store.markedDays = new Set(data.markedDays)
      if (data.selectedMunicipalityId !== undefined) store.selectedMunicipalityId = data.selectedMunicipalityId
      if (data.maxVacationDays) store.maxVacationDays = data.maxVacationDays
      if (data.carryOverDays) store.carryOverDays = data.carryOverDays
      if (data.year) store.year = data.year
      if (data.theme) store.theme = data.theme
      if (data.locale) store.locale = data.locale
      
      notifySuccess()
    } catch (error) {
      alert(t('export.importError'))
    }
  }
  
  // Reset input
  target.value = ''
}

const notifySuccess = () => {
  showSuccess.value = true
  setTimeout(() => {
    showSuccess.value = false
    isOpen.value = false
  }, 2000)
}
</script>

<template>
  <div class="relative inline-block">
    <button
      @click="isOpen = !isOpen"
      class="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      :title="t('export.title')"
      :aria-label="t('export.title')"
    >
      <Download class="w-4 h-4" role="img" :aria-label="t('export.title')" />
    </button>

    <!-- Dropdown Menu -->
    <div
      v-if="isOpen"
      class="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-100 dark:border-gray-700 py-2 z-[100] transform transition-all"
    >
      <button
        @click="handleExportICS"
        class="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors text-left"
      >
        <Calendar class="w-4 h-4 text-blue-500" />
        {{ t('export.calendar') }}
      </button>

      <button
        @click="handleExportImage"
        :disabled="isExportingImage"
        class="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors text-left disabled:opacity-50"
      >
        <Loader2 v-if="isExportingImage" class="w-4 h-4 animate-spin text-green-500" />
        <ImageIcon v-else class="w-4 h-4 text-green-500" />
        {{ isExportingImage ? t('export.exporting') : t('export.image') }}
      </button>

      <div class="my-1 border-t border-gray-100 dark:border-gray-700"></div>

      <button
        @click="handleExportJSON"
        class="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors text-left"
      >
        <Database class="w-4 h-4 text-amber-500" />
        {{ t('export.json') }}
      </button>

      <button
        @click="triggerImport"
        class="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors text-left"
      >
        <Upload class="w-4 h-4 text-purple-500" />
        {{ t('export.import') }}
      </button>

      <!-- Hidden file input -->
      <input
        ref="fileInput"
        type="file"
        accept=".json"
        class="hidden"
        @change="handleImportJSON"
      />

      <!-- Success Indicator -->
      <div v-if="showSuccess" class="absolute inset-0 bg-white/90 dark:bg-gray-800/90 flex items-center justify-center rounded-lg">
        <div class="flex items-center gap-2 text-green-600 font-medium animate-bounce">
          <Check class="w-5 h-5" />
          {{ t('export.success') }}
        </div>
      </div>
    </div>

    <!-- Backdrop to close -->
    <div
      v-if="isOpen"
      @click="isOpen = false"
      class="fixed inset-0 z-[-1]"
    ></div>
  </div>
</template>
