import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import DashboardSidebar from './DashboardSidebar.vue'

describe('DashboardSidebar', () => {
  const defaultProps = {
    usedWorkDays: 5,
    remainingDays: 17,
    isOverBudget: false,
    longestRestPeriod: 9,
    maxVacationDays: 22
  }

  it('renders "Saldo de Férias" and shows the maxVacationDays value', () => {
    const wrapper = mount(DashboardSidebar, {
      props: defaultProps
    })
    expect(wrapper.text()).toContain('Saldo de Férias')
    expect(wrapper.text()).toContain('22')
  })

  it('renders "Dias Usados" label and shows the usedWorkDays value', () => {
    const wrapper = mount(DashboardSidebar, {
      props: defaultProps
    })
    expect(wrapper.text()).toContain('Dias Usados')
    expect(wrapper.text()).toContain('5')
  })

  it('renders "Dias Restantes" label and shows the remainingDays value', () => {
    const wrapper = mount(DashboardSidebar, {
      props: defaultProps
    })
    expect(wrapper.text()).toContain('Dias Restantes')
    expect(wrapper.text()).toContain('17')
  })

  it('renders "Maior Período de Descanso" label and shows longestRestPeriod value', () => {
    const wrapper = mount(DashboardSidebar, {
      props: defaultProps
    })
    expect(wrapper.text()).toContain('Maior Período de Descanso')
    expect(wrapper.text()).toContain('9')
  })

  it('when isOverBudget is false, remaining days text does not have text-red-600 class', () => {
    const wrapper = mount(DashboardSidebar, {
      props: defaultProps
    })
    const remainingValue = wrapper.find('[data-testid="remaining-days"]')
    expect(remainingValue.classes()).not.toContain('text-red-600')
  })

  it('when isOverBudget is true, remaining days text has text-red-600 class', () => {
    const wrapper = mount(DashboardSidebar, {
      props: {
        ...defaultProps,
        isOverBudget: true
      }
    })
    const remainingValue = wrapper.find('[data-testid="remaining-days"]')
    expect(remainingValue.classes()).toContain('text-red-600')
  })
})
