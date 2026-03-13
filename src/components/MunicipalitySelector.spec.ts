import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { useConfigStore } from '../store/config'
import MunicipalitySelector from './MunicipalitySelector.vue'

describe('MunicipalitySelector', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('filters municipalities by partial name match', async () => {
    const wrapper = mount(MunicipalitySelector, {
      global: { plugins: [createPinia()] }
    })
    const input = wrapper.find('input')
    await input.trigger('focus')
    await input.setValue('Lis')
    expect(wrapper.text()).toContain('Lisboa')
  })

  it('no results when query < 2 chars', async () => {
    const wrapper = mount(MunicipalitySelector, {
      global: { plugins: [createPinia()] }
    })
    const input = wrapper.find('input')
    await input.trigger('focus')
    await input.setValue('L')
    expect(wrapper.findAll('li')).toHaveLength(0)
  })

  it('updates configStore.selectedMunicipalityId on selection', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const wrapper = mount(MunicipalitySelector, {
      global: { plugins: [pinia] }
    })
    const input = wrapper.find('input')
    await input.trigger('focus')
    await input.setValue('Lis')
    const items = wrapper.findAll('li')
    expect(items.length).toBeGreaterThan(0)
    await items[0].trigger('click')
    const store = useConfigStore()
    expect(store.selectedMunicipalityId).not.toBeNull()
  })

  it('clears configStore.selectedMunicipalityId when input cleared', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const wrapper = mount(MunicipalitySelector, {
      global: { plugins: [pinia] }
    })
    const input = wrapper.find('input')
    await input.trigger('focus')
    // First select a municipality
    await input.setValue('Lis')
    const items = wrapper.findAll('li')
    await items[0].trigger('click')
    const store = useConfigStore()
    expect(store.selectedMunicipalityId).not.toBeNull()
    // Now clear the input
    await input.setValue('')
    expect(store.selectedMunicipalityId).toBeNull()
  })
})
