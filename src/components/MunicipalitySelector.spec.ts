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
    await wrapper.find('input').setValue('Lis')
    expect(wrapper.text()).toContain('Lisboa')
  })

  it('no results when query < 2 chars', async () => {
    const wrapper = mount(MunicipalitySelector, {
      global: { plugins: [createPinia()] }
    })
    await wrapper.find('input').setValue('L')
    expect(wrapper.findAll('li')).toHaveLength(0)
  })

  it('updates configStore.selectedMunicipalityId on selection', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const wrapper = mount(MunicipalitySelector, {
      global: { plugins: [pinia] }
    })
    await wrapper.find('input').setValue('Lis')
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
    // First select a municipality
    await wrapper.find('input').setValue('Lis')
    const items = wrapper.findAll('li')
    await items[0].trigger('click')
    const store = useConfigStore()
    expect(store.selectedMunicipalityId).not.toBeNull()
    // Now clear the input
    await wrapper.find('input').setValue('')
    expect(store.selectedMunicipalityId).toBeNull()
  })
})
