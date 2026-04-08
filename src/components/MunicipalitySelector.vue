<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useConfigStore } from '../store/config'
import municipalitiesData from '../data/municipalities.json'

const { t } = useI18n()
const configStore = useConfigStore()
const query = ref('')
const isOpen = ref(false)
const isFocused = ref(false)

onMounted(() => {
  if (configStore.selectedMunicipalityId) {
    const mun = municipalitiesData.find((m) => m.id === configStore.selectedMunicipalityId)
    if (mun) {
      query.value = mun.name
    }
  }
})

const filtered = computed(() =>
  query.value.length < 2
    ? []
    : municipalitiesData
        .filter((m) => m.name.toLowerCase().includes(query.value.toLowerCase()))
        .slice(0, 10)
)

function selectMunicipality(mun: { id: string; name: string }) {
  configStore.selectedMunicipalityId = mun.id
  query.value = mun.name
  isOpen.value = false
}

watch(query, (val) => {
  if (!val) {
    configStore.selectedMunicipalityId = null
  }
  if (isFocused.value) {
    isOpen.value = val.length >= 2
  }
})

function onFocus() {
  isFocused.value = true
  isOpen.value = query.value.length >= 2
}

function onBlur() {
  isFocused.value = false
  setTimeout(() => {
    isOpen.value = false
  }, 150)
}
</script>

<template>
  <div class="relative">
    <label for="municipality-search" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
      {{ t('municipality.label') }}
    </label>
    <input
      id="municipality-search"
      v-model="query"
      type="text"
      :placeholder="t('municipality.search')"
      class="w-full border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
      @focus="onFocus"
      @blur="onBlur"
    />
    <Transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <ul
        v-if="filtered.length > 0 && isOpen"
        class="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg max-h-60 overflow-auto transition-colors"
      >
        <li
          v-for="mun in filtered"
          :key="mun.id"
          class="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100"
          @click="selectMunicipality(mun)"
        >
          {{ mun.name }}
          <span class="text-gray-400 dark:text-gray-500 text-xs ml-1">{{ mun.district }}</span>
        </li>
      </ul>
    </Transition>
  </div>
</template>
