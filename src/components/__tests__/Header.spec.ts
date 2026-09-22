import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'

const mockOpenText = vi.fn()
const mockOpenComp = vi.fn()

vi.mock('@/composables/useModal', () => ({
  useModal: () => ({
    openText: mockOpenText,
    openComp: mockOpenComp,
  }),
}))

import Header from '@/components/Header.vue'

const createWrapper = (httpMock: any) => {
  const wrapper = mount(Header, {
    global: {
      provide: { http: httpMock },
      stubs: ['font-awesome-icon'],
    },
  })
  return { wrapper }
}

describe('Header component', () => {
  let httpMock: any
  let wrapper: any

  beforeEach(() => {
    httpMock = { get: vi.fn() }
    ;({ wrapper } = createWrapper(httpMock))
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('toggles the apps overlay when the nav button is clicked', async () => {
    const navBtn = wrapper.find('#button-nav')
    const overlay = wrapper.find('#nav-overlay')

    expect(overlay.classes()).not.toContain('show')

    await navBtn.trigger('click')
    await wrapper.vm.$nextTick()
    expect(overlay.classes()).toContain('show')

    await navBtn.trigger('click')
    await wrapper.vm.$nextTick()
    expect(overlay.classes()).not.toContain('show')
  })

  it.todo('fetches sites on mount and populates the list', async () => {
    const fakeSites = [{ title: 'App A', url: 'https://a.example' }]

    httpMock.get.mockResolvedValueOnce({ data: { body: fakeSites } })

    // this never works
    await vi.waitUntil(() => wrapper.vm.sites.length === fakeSites.length)

    expect(wrapper.vm.sites).toEqual(fakeSites)
  })

  it('opens the help modal when the help button is clicked', async () => {
    const helpBtn = wrapper.find('#button-help')
    await helpBtn.trigger('click')

    expect(mockOpenText).toHaveBeenCalledTimes(1)
    const payload = mockOpenText.mock.calls[0][0]
    expect(payload).toMatchObject({
      title: 'Welcome to Axe',
      html: expect.any(String),
    })
  })

  it('opens the settings modal with the SettingsForm component', async () => {
    const settingsBtn = wrapper.find('#button-settings')
    await settingsBtn.trigger('click')

    expect(mockOpenComp).toHaveBeenCalledTimes(1)
    const componentPassed = mockOpenComp.mock.calls[0][0]

    expect(typeof componentPassed).toBe('object')
    expect(componentPassed).toHaveProperty('render')
  })
})
