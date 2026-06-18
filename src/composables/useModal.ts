// src/composables/useModal.ts
import { computed } from 'vue'
import { useModalStore } from '@/stores/modal'

export function useModal() {
  const store = useModalStore()
  return {
    openText: (opts: { title: string; html: string }) => store.openText(opts),

    openComp: (comp: unknown, props?: Record<string, unknown>) => store.openComponent(comp, props),

    close: () => store.close(),
    isOpen: computed(() => store.isOpen),
  }
}
