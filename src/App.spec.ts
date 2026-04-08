import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import App from './App.vue'
import i18n from './i18n'
import { useConfigStore } from './store/config'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

function findButtonByText(wrapper: ReturnType<typeof mount>, text: string) {
  return wrapper.findAll('button').find((button) => button.text().trim() === text)
}

describe('App modal and toast flows', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [{ date: '2026-01-01', localName: 'Ano Novo', global: true }]
    }) as any
  })

  it('uses in-app confirmation and toast when clearing selections', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const store = useConfigStore()
    store.toggleVacationDay('2026-06-01')

    const wrapper = mount(App, {
      global: {
        plugins: [pinia, i18n],
        stubs: {
          YearGrid: { template: '<div />' },
          MunicipalitySelector: { template: '<div />' },
          DashboardSidebar: { template: '<div />' },
          ExportControls: { template: '<div />' }
        }
      }
    })

    await flushPromises()
    const clearButton = findButtonByText(wrapper, 'Limpar tudo')
    expect(clearButton).toBeTruthy()

    await clearButton!.trigger('click')
    expect(wrapper.text()).toContain('Limpar seleções')

    const confirmButton = findButtonByText(wrapper, 'Confirmar')
    expect(confirmButton).toBeTruthy()
    await confirmButton!.trigger('click')
    await flushPromises()

    expect(store.markedDays.size).toBe(0)
    expect(wrapper.text()).toContain('Seleções limpas com sucesso.')
  })

  it('confirms year change in-app and updates year with success toast', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const store = useConfigStore()
    const checkSpy = vi.spyOn(store, 'checkHolidaysExist').mockResolvedValue(true)

    const wrapper = mount(App, {
      global: {
        plugins: [pinia, i18n],
        stubs: {
          YearGrid: { template: '<div />' },
          MunicipalitySelector: { template: '<div />' },
          DashboardSidebar: { template: '<div />' },
          ExportControls: { template: '<div />' }
        }
      }
    })

    await flushPromises()

    const yearInput = wrapper.find('input[type="number"]')
    await yearInput.setValue('2027')
    await yearInput.trigger('change')

    expect(wrapper.text()).toContain('Alterar ano')

    const confirmButton = findButtonByText(wrapper, 'Confirmar')
    expect(confirmButton).toBeTruthy()
    await confirmButton!.trigger('click')
    await flushPromises()

    expect(checkSpy).toHaveBeenCalledWith(2027)
    expect(store.year).toBe(2027)
    expect(wrapper.text()).toContain('Ano alterado para 2027.')
  })
})
