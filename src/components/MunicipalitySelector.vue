<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useConfigStore } from '../store/config'
import municipalitiesData from '../data/municipalities.json'

const configStore = useConfigStore()
const query = ref('')
const isOpen = ref(false)

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
  isOpen.value = val.length >= 2
})

function onBlur() {
  setTimeout(() => {
    isOpen.value = false
  }, 150)
}
</script>

<template>
  <div class="relative">
    <input
      v-model="query"
      type="text"
      placeholder="Pesquisar município..."
      class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      @focus="isOpen = query.length >= 2"
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
        class="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto"
      >
        <li
          v-for="mun in filtered"
          :key="mun.id"
          class="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100"
          @click="selectMunicipality(mun)"
        >
          {{ mun.name }}
          <span class="text-gray-400 text-xs ml-1">{{ mun.district }}</span>
        </li>
      </ul>
    </Transition>
  </div>
</template>
