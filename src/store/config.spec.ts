import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useConfigStore } from './config'

const STORAGE_KEY = 'calendar-vacation-planner-v1'

describe('Config Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('markedDays starts as an empty Set', () => {
    const store = useConfigStore()
    expect(store.markedDays).toBeInstanceOf(Set)
    expect(store.markedDays.size).toBe(0)
  })

  it('toggleVacationDay adds a date to markedDays', () => {
    const store = useConfigStore()
    store.toggleVacationDay('2026-06-01')
    expect(store.markedDays.has('2026-06-01')).toBe(true)
    expect(store.markedDays.size).toBe(1)
  })

  it('calling toggleVacationDay twice removes the date', () => {
    const store = useConfigStore()
    store.toggleVacationDay('2026-06-01')
    store.toggleVacationDay('2026-06-01')
    expect(store.markedDays.has('2026-06-01')).toBe(false)
    expect(store.markedDays.size).toBe(0)
  })

  it('toggling one date does not affect other dates in the Set', () => {
    const store = useConfigStore()
    store.toggleVacationDay('2026-06-01')
    store.toggleVacationDay('2026-06-02')
    expect(store.markedDays.has('2026-06-01')).toBe(true)
    expect(store.markedDays.has('2026-06-02')).toBe(true)
    expect(store.markedDays.size).toBe(2)
    
    store.toggleVacationDay('2026-06-01')
    expect(store.markedDays.has('2026-06-01')).toBe(false)
    expect(store.markedDays.has('2026-06-02')).toBe(true)
    expect(store.markedDays.size).toBe(1)
  })

  it('clearMarkedDays resets markedDays to an empty Set', () => {
    const store = useConfigStore()
    store.toggleVacationDay('2026-06-01')
    store.toggleVacationDay('2026-06-02')
    expect(store.markedDays.size).toBe(2)
    
    store.clearMarkedDays()
    expect(store.markedDays.size).toBe(0)
  })

  it('clearMarkedDays also clears selected and hovered holidays', () => {
    const store = useConfigStore()
    store.selectedHoliday = {
      date: '2026-01-01',
      name: 'holidays.newYear',
      type: 'national'
    }
    store.hoveredHoliday = {
      date: '2026-01-01',
      name: 'holidays.newYear',
      type: 'national'
    }

    store.clearMarkedDays()

    expect(store.selectedHoliday).toBeNull()
    expect(store.hoveredHoliday).toBeNull()
  })

  describe('persistence', () => {
    it('initializes with values from localStorage if available', () => {
      const savedState = {
        selectedMunicipalityId: 'lisboa',
        markedDays: ['2026-01-01', '2026-01-02'],
        carryOverDays: 3
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedState))
      
      const store = useConfigStore()
      
      expect(store.selectedMunicipalityId).toBe('lisboa')
      expect(store.markedDays).toBeInstanceOf(Set)
      expect(store.markedDays.has('2026-01-01')).toBe(true)
      expect(store.markedDays.has('2026-01-02')).toBe(true)
      expect(store.markedDays.size).toBe(2)
      expect(store.carryOverDays).toBe(3)
    })

    it('saves changes to localStorage when state updates', async () => {
      const store = useConfigStore()
      
      store.selectedMunicipalityId = 'porto'
      store.toggleVacationDay('2026-08-15')
      store.carryOverDays = 4
      
      // We need to wait for the watcher to fire if we use watch
      // Since it's synchronous in Vue 3 for some cases, but Pinia uses watch internally.
      // Let's wait a tick.
      await new Promise(resolve => setTimeout(resolve, 0))
      
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
      expect(stored.selectedMunicipalityId).toBe('porto')
      expect(stored.markedDays).toContain('2026-08-15')
      expect(stored.carryOverDays).toBe(4)
    })
  })

  describe('checkHolidaysExist', () => {
    it('returns true when API returns data', async () => {
      const store = useConfigStore()
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [{ date: '2026-01-01' }]
      })
      
      const result = await store.checkHolidaysExist(2026)
      expect(result).toBe(true)
    })

    it('returns false when API returns error', async () => {
      const store = useConfigStore()
      global.fetch = vi.fn().mockResolvedValue({
        ok: false
      })
      
      const result = await store.checkHolidaysExist(2026)
      expect(result).toBe(false)
    })

    it('returns false when fetch throws', async () => {
      const store = useConfigStore()
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'))
      
      const result = await store.checkHolidaysExist(2026)
      expect(result).toBe(false)
    })
  })
})
