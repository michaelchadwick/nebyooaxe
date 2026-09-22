import { describe, it, expect } from 'vitest'
import Header from '@/components/Header.vue' // <-- this should resolve

describe('alias', () => {
  it('imports Header without error', () => {
    expect(Header).toBeDefined()
  })
})
