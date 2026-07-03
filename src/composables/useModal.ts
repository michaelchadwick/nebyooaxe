// src/composables/useModal.ts
import { computed } from 'vue'
import { useModalStore } from '@/stores/modal'

export function useModal() {
  const store = useModalStore()
  const composable = {
    openText: (opts: { title: string; html: string }) => store.openText(opts),
    openComp: (comp: unknown, props?: Record<string, unknown>) => store.openComponent(comp, props),
    close: () => store.close(),

    // expose individual state items
    component: computed(() => store.component),
    componentProps: computed(() => store.componentProps),
    title: computed(() => store.title),
    html: computed(() => store.html),
    isOpen: computed(() => store.isOpen),
  }
  return composable
}
