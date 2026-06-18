// src/stores/modal.ts
import { defineStore } from 'pinia'
import type { Ref } from 'vue'
import { ref } from 'vue'

export const useModalStore = defineStore('modal', () => {
  const isOpen: Ref<boolean> = ref(false)
  const title: Ref<string | null> = ref(null)
  const html: Ref<string | null> = ref(null)
  const component: Ref<unknown | null> = ref(null)
  const componentProps: Ref<Record<string, unknown>> = ref({})

  function openText(opts: { title: string; html: string }) {
    title.value = opts.title
    html.value = opts.html
    component.value = null
    componentProps.value = {}
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
    isOpen.value = false
    title.value = null
    html.value = null
    component.value = null
    componentProps.value = {}
  }

  return { isOpen, title, html, component, componentProps, openText, openComponent, close }
})
