import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { mount } from '@vue/test-utils'
import Fretboard from '../Fretboard.vue'

describe('Fretboard', () => {
  beforeEach(() => {
    // creates a fresh pinia and makes it active
    // so it's automatically picked up by any useStore() call
    // without having to pass it to it: `useStore(pinia)`
    setActivePinia(createPinia())
  })

  it('renders properly', () => {
    const wrapper = mount(Fretboard)
    const fretNumbers = Array(25)
      .fill(0)
      .map((_, i) => i.toString())
      .join('')
    const fretNotes = 'EBGDAE'
    expect(wrapper.text()).toEqual(fretNumbers + fretNotes)
  })
})
