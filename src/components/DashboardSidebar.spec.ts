import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import DashboardSidebar from './DashboardSidebar.vue'
import i18n from '../i18n'

describe('DashboardSidebar', () => {
  const defaultProps = {
    usedWorkDays: 5,
    totalSelectedDays: 7,
    remainingDays: 17,
    isOverBudget: false,
    longestRestPeriod: { days: 9, startDate: new Date('2026-06-01T00:00:00') },
    maxVacationDays: 22,
    carryOverDays: 3,
    markedDays: []
  }

  const mountOptions = {
    props: defaultProps,
    global: {
      plugins: [i18n, createPinia()]
    }
  }

  it('renders "Saldo de Férias" and shows the maxVacationDays value in input', () => {
    const wrapper = mount(DashboardSidebar, mountOptions)
    expect(wrapper.text()).toContain('Saldo de Férias')
    const input = wrapper.find('input[type="number"]')
    expect((input.element as HTMLInputElement).value).toBe('22')
  })

  it('emits update:max-vacation-days when input changes', async () => {
    const wrapper = mount(DashboardSidebar, mountOptions)
    const input = wrapper.find('#max-days-input')
    await input.setValue(25)
    expect(wrapper.emitted('update:max-vacation-days')).toBeTruthy()
    expect(wrapper.emitted('update:max-vacation-days')![0]).toEqual([25])
  })

  it('emits update:carry-over-days when carry over input changes', async () => {
    const wrapper = mount(DashboardSidebar, mountOptions)
    const input = wrapper.find('#carry-over-days-input')
    await input.setValue(4)
    expect(wrapper.emitted('update:carry-over-days')).toBeTruthy()
    expect(wrapper.emitted('update:carry-over-days')![0]).toEqual([4])
  })

  it('renders "Dias Usados" label and shows the usedWorkDays value', () => {
    const wrapper = mount(DashboardSidebar, mountOptions)
    expect(wrapper.text()).toContain('Dias Usados')
    expect(wrapper.text()).toContain('5')
  })

  it('renders "Dias Consecutivos" label and shows the totalSelectedDays value', () => {
    const wrapper = mount(DashboardSidebar, mountOptions)
    expect(wrapper.text()).toContain('Dias Consecutivos')
    expect(wrapper.text()).toContain('7')
  })

  it('renders "Dias Restantes" label and shows the remainingDays value', () => {
    const wrapper = mount(DashboardSidebar, mountOptions)
    expect(wrapper.text()).toContain('Dias Restantes')
    expect(wrapper.text()).toContain('17')
  })

  it('renders carry over indicators', () => {
    const wrapper = mount(DashboardSidebar, mountOptions)
    expect(wrapper.text()).toContain('Dias Transitados')
    expect(wrapper.text()).not.toContain('Transitados Usados')
  })

  it('renders "Maior Período de Descanso" label and shows longestRestPeriod value', () => {
    const wrapper = mount(DashboardSidebar, mountOptions)
    expect(wrapper.text()).toContain('Maior Período de Descanso')
    expect(wrapper.text()).toContain('9')
    expect(wrapper.text()).toContain('JUN 01')
    expect(wrapper.text()).toContain('dias úteis consecutivos')
  })

  it('when isOverBudget is false, remaining days text does not have text-red-600 class', () => {
    const wrapper = mount(DashboardSidebar, mountOptions)
    const remainingValue = wrapper.find('[data-testid="remaining-days"]')
    expect(remainingValue.classes()).not.toContain('text-red-600')
  })

  it('when isOverBudget is true, remaining days text has text-red-600 class', () => {
    const wrapper = mount(DashboardSidebar, {
      ...mountOptions,
      props: {
        ...defaultProps,
        isOverBudget: true
      }
    })
    const remainingValue = wrapper.find('[data-testid="remaining-days"]')
    expect(remainingValue.classes()).toContain('text-red-600')
  })

  it('displays "Excedeu o seu saldo de férias!" when isOverBudget is true', () => {
    const wrapper = mount(DashboardSidebar, {
      ...mountOptions,
      props: {
        ...defaultProps,
        isOverBudget: true
      }
    })
    expect(wrapper.text()).toContain('Excedeu o seu saldo de férias!')
  })

  it('does not display warning when isOverBudget is false', () => {
    const wrapper = mount(DashboardSidebar, {
      ...mountOptions,
      props: {
        ...defaultProps,
        isOverBudget: false
      }
    })
    expect(wrapper.text()).not.toContain('Excedeu o seu saldo de férias!')
  })

  it('displays the vacation summary correctly', () => {
    const wrapper = mount(DashboardSidebar, {
      ...mountOptions,
      props: {
        ...defaultProps,
        markedDays: ['2026-02-16', '2026-02-18', '2026-03-20']
      }
    })
    const summary = wrapper.find('[data-testid="vacation-summary"]')
    expect(summary.text()).toContain('FEV: 16, 18')
    expect(summary.text()).toContain('MAR: 20')
  })
})
