// src/composables/useModal.ts
import { openModal as _open, closeModal as _close } from '@/stores/modal'

export function useModal() {
  return {
    /** Show the modal with the given title / body text */
    open: (title: string, body: string) => _open(title, body),
    /** Hide it again */
    close: _close,
  }
}
