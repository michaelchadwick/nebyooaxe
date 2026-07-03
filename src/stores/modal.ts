// src/stores/modal.ts
import { defineStore } from 'pinia'
import type { Ref } from 'vue'
import { ref } from 'vue'

export const useModalStore = defineStore('modal', () => {
  const component: Ref<unknown | null> = ref(null)
  const componentProps: Ref<Record<string, unknown>> = ref({})
  const title: Ref<string | null> = ref(null)
  const html: Ref<string | null> = ref(null)
  const isOpen: Ref<boolean> = ref(false)

  function openText(opts: { title: string; html: string }) {
    component.value = null
    componentProps.value = {}
    title.value = opts.title
    html.value = opts.html
    isOpen.value = true
  }

  function openComponent(comp: unknown, props?: Record<string, unknown>) {
    component.value = comp
    componentProps.value = props ?? {}
    title.value = null
    html.value = null
    isOpen.value = true
  }

  function close() {
    component.value = null
    componentProps.value = {}
    title.value = null
    html.value = null
    isOpen.value = false
  }

  const store = { isOpen, title, html, component, componentProps, openText, openComponent, close }

  return store
})
