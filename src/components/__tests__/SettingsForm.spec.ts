import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { mount } from '@vue/test-utils'
import SettingsForm from '../SettingsForm.vue'

describe('SettingsForm', () => {
  beforeEach(() => {
    // creates a fresh pinia and makes it active
    // so it's automatically picked up by any useStore() call
    // without having to pass it to it: `useStore(pinia)`
    setActivePinia(createPinia())
  })

  it('renders properly', () => {
    const wrapper = mount(SettingsForm)
    const headerText = 'Axe Settings '
    const controls =
      'Fret Count  Enable Fret Sound  Fret Sound Type sinesquaresawtoothtriangle Strum Pattern as enteredbottom uptop down'
    expect(wrapper.text()).toEqual(headerText + controls)
  })
})
