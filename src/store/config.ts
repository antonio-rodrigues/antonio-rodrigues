import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { format } from 'date-fns'
import { getEaster, getCarnaval, getGoodFriday, getEasterMonday, getAscension, getPentecostMonday, getCorpusChristi } from '../utils/holiday-utils'

const STORAGE_KEY = 'calendar-vacation-planner-v1'

export interface HolidayEntry {
  name: string
  type: 'national' | 'municipal'
  municipalityName?: string
}

interface SavedState {
  selectedMunicipalityId?: string | null
  markedDays?: string[]
  maxVacationDays?: number
}

function loadInitialState(): SavedState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : {}
  } catch (e) {
    console.error('Failed to load state from localStorage', e)
    return {}
  }
}

function buildFallbackHolidays(year: number): Map<string, HolidayEntry> {
  const map = new Map<string, HolidayEntry>()

  const fixed: Array<[string, number, number]> = [
    ['Ano Novo', 1, 1],
    ['Dia da Liberdade', 4, 25],
    ['Dia do Trabalhador', 5, 1],
    ['Dia de Portugal', 6, 10],
    ['Assunção de Nossa Senhora', 8, 15],
    ['Implantação da República', 10, 5],
    ['Dia de Todos-os-Santos', 11, 1],
    ['Restauração da Independência', 12, 1],
    ['Imaculada Conceição', 12, 8],
    ['Natal', 12, 25],
  ]

  for (const [name, month, day] of fixed) {
    const dateStr = format(new Date(year, month - 1, day), 'yyyy-MM-dd')
    map.set(dateStr, { name, type: 'national' })
  }

  // Mobile holidays
  const mobile: Array<[string, Date]> = [
    ['Carnaval', getCarnaval(year)],
    ['Sexta-feira Santa', getGoodFriday(year)],
    ['Páscoa', getEaster(year)],
    ['Segunda-feira de Páscoa', getEasterMonday(year)],
    ['Quinta-feira da Ascensão', getAscension(year)],
    ['Segunda-feira de Pentecostes', getPentecostMonday(year)],
    ['Corpo de Deus', getCorpusChristi(year)],
  ]

  for (const [name, date] of mobile) {
    map.set(format(date, 'yyyy-MM-dd'), { name, type: 'national' })
  }

  return map
}

export const useConfigStore = defineStore('config', () => {
  const initialState = loadInitialState()

  const year = ref(2026)
  const selectedMunicipalityId = ref<string | null>(initialState.selectedMunicipalityId ?? null)
  const maxVacationDays = ref(initialState.maxVacationDays ?? 22)
  const markedDays = ref<Set<string>>(new Set(initialState.markedDays ?? []))

  // Holiday state
  const nationalHolidays = ref<Map<string, HolidayEntry>>(new Map())
  const loadingHolidays = ref(false)
  const holidayError = ref<string | null>(null)

  async function fetchHolidays(targetYear: number): Promise<boolean> {
    loadingHolidays.value = true
    holidayError.value = null
    try {
      const res = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${targetYear}/PT`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data: Array<{ date: string; localName: string; global: boolean }> = await res.json()
      
      if (!data || data.length === 0) throw new Error('No data')

      const map = new Map<string, HolidayEntry>()
      data
        .filter(h => h.global)
        .forEach(h => map.set(h.date, { name: h.localName, type: 'national' }))
      nationalHolidays.value = map
      return true
    } catch {
      holidayError.value = 'API indisponível — a usar feriados locais'
      nationalHolidays.value = buildFallbackHolidays(targetYear)
      return false
    } finally {
      loadingHolidays.value = false
    }
  }

  async function checkHolidaysExist(targetYear: number): Promise<boolean> {
    try {
      const res = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${targetYear}/PT`)
      if (!res.ok) return false
      const data: Array<unknown> = await res.json()
      return Array.isArray(data) && data.length > 0
    } catch {
      return false
    }
  }

  function toggleVacationDay(dateStr: string) {
    const next = new Set(markedDays.value)
    if (next.has(dateStr)) {
      next.delete(dateStr)
    } else {
      next.add(dateStr)
    }
    markedDays.value = next
  }

  function clearMarkedDays() {
    markedDays.value = new Set()
  }

  // Persist state on changes
  watch(
    [selectedMunicipalityId, markedDays, maxVacationDays],
    () => {
      const stateToSave: SavedState = {
        selectedMunicipalityId: selectedMunicipalityId.value,
        markedDays: Array.from(markedDays.value),
        maxVacationDays: maxVacationDays.value
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave))
    },
    { deep: true }
  )

  // Fetch holidays on year change
  watch(() => year.value, (newYear) => {
    fetchHolidays(newYear)
  }, { immediate: true })

  return {
    year,
    selectedMunicipalityId,
    maxVacationDays,
    markedDays,
    nationalHolidays,
    loadingHolidays,
    holidayError,
    toggleVacationDay,
    clearMarkedDays,
    fetchHolidays,
    checkHolidaysExist
  }
})
