import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useHolidays } from './useHolidays'
import { useConfigStore } from '../store/config'
import { getEaster } from '../utils/holiday-utils'
import { addDays, format } from 'date-fns'

describe('useHolidays', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.restoreAllMocks()
  })

  it('returns national holidays from API', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [
        { date: '2026-01-01', localName: 'Ano Novo', global: true }
      ]
    }))

    const { holidays } = useHolidays()
    // wait for fetch to complete (watch immediate triggers fetchHolidays)
    await vi.waitUntil(() => holidays.value.size > 0)

    expect(holidays.value.get('2026-01-01')).toEqual({ date: '2026-01-01', name: 'Ano Novo', type: 'national' })
  })

  it('excludes non-global entries', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [
        { date: '2026-07-01', localName: 'Dia Açores', global: false }
      ]
    }))

    const { holidays } = useHolidays()
    await new Promise(r => setTimeout(r, 50))

    expect(holidays.value.size).toBe(0)
  })

  it('falls back when API fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network')))

    const { holidays } = useHolidays()
    await vi.waitUntil(() => holidays.value.size > 0)

    // Fallback must include Ano Novo (2026-01-01)
    expect(holidays.value.has('2026-01-01')).toBe(true)
  })

  it('resolves fixed municipal holiday', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => []
    }))

    const configStore = useConfigStore()
    configStore.selectedMunicipalityId = 'abrantes'

    const { holidays } = useHolidays()
    await new Promise(r => setTimeout(r, 50))

    // Abrantes: fixed, day 14, month 6 → 2026-06-14
    const entry = holidays.value.get('2026-06-14')
    expect(entry).toBeDefined()
    expect(entry?.type).toBe('municipal')
    expect(entry?.name).toBe('São Vicente')
  })

  it('resolves mobile municipal holiday', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => []
    }))

    const configStore = useConfigStore()
    configStore.selectedMunicipalityId = 'agueda'

    const { holidays } = useHolidays()
    await new Promise(r => setTimeout(r, 50))

    // Águeda: mobile, base easter, offset 39 → Easter(2026) + 39
    const expectedDate = format(addDays(getEaster(2026), 39), 'yyyy-MM-dd')
    const entry = holidays.value.get(expectedDate)
    expect(entry).toBeDefined()
    expect(entry?.type).toBe('municipal')
  })
})
