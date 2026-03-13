import { computed } from 'vue'
import { format, addDays } from 'date-fns'
import { useConfigStore, type HolidayEntry } from '../store/config'
import { getEaster } from '../utils/holiday-utils'
import municipalitiesData from '../data/municipalities.json'

// Local type for municipality holiday from JSON
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

export function useHolidays() {
  const configStore = useConfigStore()

  const municipalHoliday = computed<{ dateStr: string; entry: HolidayEntry } | null>(() => {
    if (!configStore.selectedMunicipalityId) return null
    const mun = (municipalitiesData as Array<{ id: string; name: string; district: string; holiday: MunicipalHolidayRule }>)
      .find(m => m.id === configStore.selectedMunicipalityId)
    if (!mun) return null
    const dateStr = resolveMunicipalHolidayDate(mun.holiday, configStore.year)
    return {
      dateStr,
      entry: {
        date: dateStr,
        name: mun.holiday.name,
        type: 'municipal',
        municipalityName: mun.name,
      }
    }
  })

  const holidays = computed<Map<string, HolidayEntry>>(() => {
    const merged = new Map(configStore.nationalHolidays)
    if (municipalHoliday.value) {
      merged.set(municipalHoliday.value.dateStr, municipalHoliday.value.entry)
    }
    return merged
  })

  return { 
    holidays, 
    loading: computed(() => configStore.loadingHolidays), 
    error: computed(() => configStore.holidayError) 
  }
}
