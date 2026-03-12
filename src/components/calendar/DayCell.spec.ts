import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import DayCell from './DayCell.vue'

const baseDay = {
  date: new Date(2026, 0, 1),
  dayOfMonth: 1,
  isWeekend: false,
  isHoliday: false
}

describe('DayCell', () => {
  it('applies bg-red-100 text-red-700 for national holiday', () => {
    const wrapper = mount(DayCell, {
      props: {
        day: {
          ...baseDay,
          isHoliday: true,
          holidayType: 'national',
          holidayName: 'Ano Novo'
        }
      }
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
      }
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
          holidayName: 'Ano Novo'
        }
      }
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
      }
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
      }
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
          holidayName: 'Natal'
        }
      }
    })
    expect(wrapper.classes()).toContain('bg-red-100')
    expect(wrapper.classes()).not.toContain('bg-pink-50')
  })
})
