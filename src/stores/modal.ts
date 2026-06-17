// src/stores/modal.ts
import { ref } from 'vue'

export const isModalOpen = ref(false)
export const modalTitle = ref('')
export const modalBody = ref<string | null>(null)

export function openModal(title: string, body: string) {
  modalTitle.value = title
  modalBody.value = body
  isModalOpen.value = true
}

export function closeModal() {
  isModalOpen.value = false
}
