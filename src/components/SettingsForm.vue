<!-- src/components/SettingsForm.vue -->
<script setup lang="ts">
import { useSettingsStore } from '@/stores/settings'

const settings = useSettingsStore()
function update() {
  settings.toggleEnableFretSound()
}
</script>

<template>
  <div>
    <h2>Axe Settings</h2>
    <div class="settings-form">
      <label>
        <input type="checkbox" :checked="settings.enableFretSound" @change="update" />
        <span>Enable fret sound</span>
      </label>
    </div>
  </div>
</template>

<style scoped>
.settings-form {
  display: flex;
  flex-direction: column;
}
</style>
