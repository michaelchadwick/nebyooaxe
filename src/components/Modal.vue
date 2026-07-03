<!-- src/components/Modal.vue -->
<script setup lang="ts">
import { Teleport } from 'vue'
import { useModalStore } from '@/stores/modal'

const modal = useModalStore()
function close() {
  modal.close()
}
</script>

<template>
  <Teleport to="body" v-if="modal.isOpen">
    <div class="overlay" @click.self="close">
      <div class="dialog" role="dialog" aria-modal="true">
        <h2 v-if="modal.title">{{ modal.title }}</h2>
        <div v-if="modal.html" v-html="modal.html" class="content"></div>

        <!-- component slot -->
        <component
          v-else-if="modal.component"
          :is="modal.component"
          v-bind="modal.componentProps"
          @close="close"
          class="content"
        />

        <button class="close-btn" @click="close">Close</button>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.dialog {
  background: var(--vt-c-white);
  padding: 1.5rem;
  border-radius: 0.3rem;
  max-width: 90vw;
  width: 400px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}
.content p {
  padding-bottom: 10px;
}
.close-btn {
  margin-top: 0.5rem;
  background: var(--vt-c-red);
  color: var(--vt-c-white);
  border: none;
  cursor: pointer;
  padding: 0.5rem 1rem;
}
</style>
