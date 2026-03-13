import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { format } from 'date-fns'
import { getEaster, getCarnaval, getGoodFriday, getEasterMonday, getAscension, getPentecostMonday, getCorpusChristi } from '../utils/holiday-utils'
import i18n from '../i18n'

const STORAGE_KEY = 'calendar-vacation-planner-v1'

export interface HolidayEntry {
  date: string
  name: string
  type: 'national' | 'municipal'
  municipalityName?: string
}

interface SavedState {
  selectedMunicipalityId?: string | null
  markedDays?: string[]
  maxVacationDays?: number
  theme?: 'light' | 'dark'
  locale?: 'pt' | 'en'
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
    ['holidays.newYear', 1, 1],
    ['holidays.freedomDay', 4, 25],
    ['holidays.labourDay', 5, 1],
    ['holidays.portugalDay', 6, 10],
    ['holidays.assumption', 8, 15],
    ['holidays.republicDay', 10, 5],
    ['holidays.allSaints', 11, 1],
    ['holidays.restoration', 12, 1],
    ['holidays.immaculateConception', 12, 8],
    ['holidays.christmas', 12, 25],
  ]

  for (const [name, month, day] of fixed) {
    const dateStr = format(new Date(year, month - 1, day), 'yyyy-MM-dd')
    map.set(dateStr, { date: dateStr, name, type: 'national' })
  }

  // Mobile holidays
  const mobile: Array<[string, Date]> = [
    ['holidays.carnaval', getCarnaval(year)],
    ['holidays.goodFriday', getGoodFriday(year)],
    ['holidays.easter', getEaster(year)],
    ['holidays.easterMonday', getEasterMonday(year)],
    ['holidays.ascension', getAscension(year)],
    ['holidays.pentecostMonday', getPentecostMonday(year)],
    ['holidays.corpusChristi', getCorpusChristi(year)],
  ]

  for (const [name, date] of mobile) {
    const dStr = format(date, 'yyyy-MM-dd')
    map.set(dStr, { date: dStr, name, type: 'national' })
  }

  return map
}

export const useConfigStore = defineStore('config', () => {
  const initialState = loadInitialState()

  const year = ref(2026)
  const selectedMunicipalityId = ref<string | null>(initialState.selectedMunicipalityId ?? null)
  const maxVacationDays = ref(initialState.maxVacationDays ?? 22)
  const markedDays = ref<Set<string>>(new Set(initialState.markedDays ?? []))
  const theme = ref<'light' | 'dark'>(initialState.theme ?? 'light')
  const locale = ref<'pt' | 'en'>(initialState.locale ?? 'pt')
  const hoveredHoliday = ref<HolidayEntry | null>(null)

  // Sync i18n locale with store locale
  watch(locale, (newLocale) => {
    (i18n.global.locale as any).value = newLocale
  }, { immediate: true })

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
        .forEach(h => map.set(h.date, { date: h.date, name: h.localName, type: 'national' }))
      nationalHolidays.value = map
      return true
    } catch {
      holidayError.value = 'app.holidayError'
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

  function toggleTheme() {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
  }

  function setLocale(newLocale: 'pt' | 'en') {
    locale.value = newLocale
  }

  // Persist state on changes
  watch(
    [selectedMunicipalityId, markedDays, maxVacationDays, theme, locale],
    () => {
      const stateToSave: SavedState = {
        selectedMunicipalityId: selectedMunicipalityId.value,
        markedDays: Array.from(markedDays.value),
        maxVacationDays: maxVacationDays.value,
        theme: theme.value,
        locale: locale.value
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
    theme,
    locale,
    hoveredHoliday,
    nationalHolidays,
    loadingHolidays,
    holidayError,
    toggleVacationDay,
    clearMarkedDays,
    toggleTheme,
    setLocale,
    fetchHolidays,
    checkHolidaysExist
  }
})
