import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import Fretboard from '../Fretboard.vue'

describe('Fretboard', () => {
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
