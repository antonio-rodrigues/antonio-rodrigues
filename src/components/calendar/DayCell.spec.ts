import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import DayCell from './DayCell.vue'
import { setActivePinia, createPinia } from 'pinia'
import { useConfigStore } from '../../store/config'
import i18n from '../../i18n'

const baseDay = {
  date: new Date(2026, 5, 1), // Monday, 2026-06-01
  dayOfMonth: 1,
  isWeekend: false,
  isHoliday: false
}

describe('DayCell', () => {
  let pinia: any

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
    localStorage.clear()
  })

  it('applies bg-red-100 text-red-700 for national holiday', () => {
    const wrapper = mount(DayCell, {
      props: {
        day: {
          ...baseDay,
          isHoliday: true,
          holidayType: 'national',
          holidayName: 'holidays.newYear'
        }
      },
      global: { plugins: [pinia, i18n] }
    })
    expect(wrapper.classes()).toContain('bg-red-100')
    expect(wrapper.classes()).toContain('text-red-700')
  })

  it('applies bg-orange-100 text-orange-700 for municipal holiday', () => {
    const wrapper = mount(DayCell, {
      props: {
        day: {
          ...baseDay,
          isHoliday: true,
          holidayType: 'municipal',
          holidayName: 'Santo António',
          holidayMunicipalityName: 'Lisboa'
        }
      },
      global: { plugins: [pinia, i18n] }
    })
    expect(wrapper.classes()).toContain('bg-orange-100')
    expect(wrapper.classes()).toContain('text-orange-700')
  })

  it('has title attribute with holiday name for national holiday', () => {
    const wrapper = mount(DayCell, {
      props: {
        day: {
          ...baseDay,
          isHoliday: true,
          holidayType: 'national',
          holidayName: 'holidays.newYear'
        }
      },
      global: { plugins: [pinia, i18n] }
    })
    expect(wrapper.attributes('title')).toBe('Ano Novo · Feriado Nacional')
  })

  it('has title attribute with municipality name for municipal holiday', () => {
    const wrapper = mount(DayCell, {
      props: {
        day: {
          ...baseDay,
          isHoliday: true,
          holidayType: 'municipal',
          holidayName: 'Santo António',
          holidayMunicipalityName: 'Lisboa'
        }
      },
      global: { plugins: [pinia, i18n] }
    })
    expect(wrapper.attributes('title')).toBe('Santo António · Feriado Municipal (Lisboa)')
  })

  it('applies bg-pink-50 text-pink-600 for weekend non-holiday', () => {
    const wrapper = mount(DayCell, {
      props: {
        day: {
          ...baseDay,
          isWeekend: true,
          isHoliday: false
        }
      },
      global: { plugins: [pinia, i18n] }
    })
    expect(wrapper.classes()).toContain('bg-pink-50')
    expect(wrapper.classes()).toContain('text-pink-600')
  })

  it('holiday overrides weekend — national holiday on weekend shows bg-red-100', () => {
    const wrapper = mount(DayCell, {
      props: {
        day: {
          ...baseDay,
          isWeekend: true,
          isHoliday: true,
          holidayType: 'national',
          holidayName: 'holidays.christmas'
        }
      },
      global: { plugins: [pinia, i18n] }
    })
    expect(wrapper.classes()).toContain('bg-red-100')
    expect(wrapper.classes()).not.toContain('bg-pink-50')
  })

  it('workday with isVacation=true has class bg-green-200 text-green-700', async () => {
    const store = useConfigStore()
    store.toggleVacationDay('2026-06-01')
    
    const wrapper = mount(DayCell, {
      props: { day: baseDay },
      global: { plugins: [pinia, i18n] }
    })
    
    expect(wrapper.classes()).toContain('bg-green-200')
    expect(wrapper.classes()).toContain('text-green-700')
  })

  it('renders an accessible button with pressed state for workdays', () => {
    const wrapper = mount(DayCell, {
      props: { day: baseDay },
      global: { plugins: [pinia, i18n] }
    })

    expect(wrapper.element.tagName).toBe('BUTTON')
    expect(wrapper.attributes('aria-disabled')).toBe('false')
    expect(wrapper.attributes('aria-pressed')).toBe('false')
    expect(wrapper.attributes('aria-label')).toContain('Dia')
  })

  it('marks workday as pressed when selected', () => {
    const store = useConfigStore()
    store.toggleVacationDay('2026-06-01')

    const wrapper = mount(DayCell, {
      props: { day: baseDay },
      global: { plugins: [pinia, i18n] }
    })

    expect(wrapper.attributes('aria-pressed')).toBe('true')
  })

  it('carry over vacation day has light yellow class', () => {
    const store = useConfigStore()
    store.carryOverDays = 2
    store.toggleVacationDay('2026-01-02')
    store.toggleVacationDay('2026-01-05')

    const wrapper = mount(DayCell, {
      props: {
        day: {
          date: new Date(2026, 0, 2),
          dayOfMonth: 2,
          isWeekend: false,
          isHoliday: false
        }
      },
      global: { plugins: [pinia, i18n] }
    })

    expect(wrapper.classes()).toContain('bg-amber-200')
    expect(wrapper.classes()).toContain('text-amber-900')
    expect(wrapper.classes()).not.toContain('bg-green-200')
  })

  it('marked day after March keeps regular vacation green', () => {
    const store = useConfigStore()
    store.carryOverDays = 3
    store.toggleVacationDay('2026-04-01')

    const wrapper = mount(DayCell, {
      props: {
        day: {
          date: new Date(2026, 3, 1),
          dayOfMonth: 1,
          isWeekend: false,
          isHoliday: false
        }
      },
      global: { plugins: [pinia, i18n] }
    })

    expect(wrapper.classes()).toContain('bg-green-200')
    expect(wrapper.classes()).toContain('text-green-700')
    expect(wrapper.classes()).not.toContain('bg-amber-200')
  })

  it('clicking a workday calls store.toggleVacationDay', async () => {
    const store = useConfigStore()
    const wrapper = mount(DayCell, {
      props: { day: baseDay },
      global: { plugins: [pinia, i18n] }
    })

    await wrapper.trigger('click')
    expect(store.markedDays.has('2026-06-01')).toBe(true)
  })

  it('clicking a holiday does NOT call store.toggleVacationDay', async () => {
    const store = useConfigStore()
    const wrapper = mount(DayCell, {
      props: {
        day: {
          ...baseDay,
          isHoliday: true,
          holidayType: 'national'
        }
      },
      global: { plugins: [pinia, i18n] }
    })

    await wrapper.trigger('click')
    expect(store.markedDays.has('2026-06-01')).toBe(false)
    expect(store.selectedHoliday?.date).toBe('2026-06-01')
    expect(store.selectedHoliday?.type).toBe('national')
  })

  it('clicking a weekend does NOT call store.toggleVacationDay', async () => {
    const store = useConfigStore()
    const wrapper = mount(DayCell, {
      props: {
        day: {
          ...baseDay,
          isWeekend: true
        }
      },
      global: { plugins: [pinia, i18n] }
    })

    await wrapper.trigger('click')
    expect(store.markedDays.has('2026-06-01')).toBe(false)
    expect(wrapper.attributes('aria-disabled')).toBe('true')
  })

  it('vacation class takes lower priority than holiday', async () => {
    const store = useConfigStore()
    store.toggleVacationDay('2026-06-01')

    const wrapper = mount(DayCell, {
      props: {
        day: {
          ...baseDay,
          isHoliday: true,
          holidayType: 'national'
        }
      },
      global: { plugins: [pinia, i18n] }
    })

    expect(wrapper.classes()).toContain('bg-red-100')
    expect(wrapper.classes()).not.toContain('bg-green-200')
  })
})
