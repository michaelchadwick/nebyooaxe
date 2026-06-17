<!-- src/components/Modal.vue -->
<script setup lang="ts">
import { Teleport } from 'vue'
import { isModalOpen, modalTitle, modalBody, closeModal } from '@/stores/modal'

function handleClose() {
  closeModal()
}
</script>

<template>
  <Teleport to="body" v-if="isModalOpen">
    <div class="modal-overlay" @click.self="handleClose">
      <div class="modal-dialog" role="dialog" aria-modal="true">
        <h2>{{ modalTitle }}</h2>
        <div class="modal-content" v-html="modalBody"></div>

        <button type="button" class="close-btn" @click="handleClose">Close</button>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; /* adjust as needed */
}
.modal-dialog {
  background: white;
  padding: 1.5rem;
  border-radius: 0.3rem;
  max-width: 90vw;
  width: 400px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}
.modal-content p {
  padding-bottom: 10px;
}
.close-btn {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background: #ff4d4f;
  color: white;
  border: none;
  cursor: pointer;
}
</style>
