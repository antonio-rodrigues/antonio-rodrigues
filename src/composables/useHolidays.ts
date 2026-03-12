import { ref, computed, watch } from 'vue'
import { format, addDays } from 'date-fns'
import { useConfigStore } from '../store/config'
import { getEaster, getCarnaval, getGoodFriday, getEasterMonday, getAscension, getPentecostMonday, getCorpusChristi } from '../utils/holiday-utils'
import municipalitiesData from '../data/municipalities.json'

export interface HolidayEntry {
  name: string
  type: 'national' | 'municipal'
  municipalityName?: string
}

// Local type for municipality holiday from JSON (avoids Holiday interface mismatch)
interface MunicipalHolidayRule {
  type: 'fixed' | 'mobile'
  day?: number
  month?: number
  name: string
  base?: string
  offset?: number
}

function resolveMunicipalHolidayDate(holiday: MunicipalHolidayRule, year: number): string {
  if (holiday.type === 'fixed') {
    return format(new Date(year, holiday.month! - 1, holiday.day!), 'yyyy-MM-dd')
  }
  // type === 'mobile', base === 'easter'
  return format(addDays(getEaster(year), holiday.offset!), 'yyyy-MM-dd')
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

export function useHolidays() {
  const configStore = useConfigStore()
  const loading = ref(false)
  const error = ref<string | null>(null)
  const nationalHolidays = ref<Map<string, HolidayEntry>>(new Map())

  async function fetchHolidays(year: number) {
    loading.value = true
    error.value = null
    try {
      const res = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/PT`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data: Array<{ date: string; localName: string; global: boolean }> = await res.json()
      const map = new Map<string, HolidayEntry>()
      data
        .filter(h => h.global)
        .forEach(h => map.set(h.date, { name: h.localName, type: 'national' }))
      nationalHolidays.value = map
    } catch {
      error.value = 'API indisponível — a usar feriados locais'
      nationalHolidays.value = buildFallbackHolidays(year)
    } finally {
      loading.value = false
    }
  }

  const municipalHoliday = computed<{ dateStr: string; entry: HolidayEntry } | null>(() => {
    if (!configStore.selectedMunicipalityId) return null
    const mun = (municipalitiesData as Array<{ id: string; name: string; district: string; holiday: MunicipalHolidayRule }>)
      .find(m => m.id === configStore.selectedMunicipalityId)
    if (!mun) return null
    const dateStr = resolveMunicipalHolidayDate(mun.holiday, configStore.year)
    return {
      dateStr,
      entry: {
        name: mun.holiday.name,
        type: 'municipal',
        municipalityName: mun.name,
      }
    }
  })

  const holidays = computed<Map<string, HolidayEntry>>(() => {
    const merged = new Map(nationalHolidays.value)
    if (municipalHoliday.value) {
      merged.set(municipalHoliday.value.dateStr, municipalHoliday.value.entry)
    }
    return merged
  })

  watch(() => configStore.year, (year) => fetchHolidays(year), { immediate: true })

  return { holidays, loading, error }
}
