<!-- src/components/SettingsForm.vue -->
<script setup lang="ts">
import { useSettingsStore } from '@/stores/settings'

const settings = useSettingsStore()

function updateEnableFretSound() {
  settings.toggleEnableFretSound()
}
</script>

<template>
  <div>
    <h2>Axe Settings</h2>
    <div class="settings-form">
      <label>
        <input
          type="checkbox"
          :checked="settings.enableFretSound"
          @change="updateEnableFretSound"
        />
        <span>Enable fret sound</span>
      </label>
      <label>
        Fret Sound
        <select v-model="settings.fretSoundType">
          <option value="sine">sine</option>
          <option value="square">square</option>
          <option value="sawtooth">sawtooth</option>
          <option value="triangle">triangle</option>
        </select>
      </label>
      <label>
        Strum Pattern
        <select v-model="settings.strumPattern">
          <option value="as-entered">as entered</option>
          <option value="bottom-up">bottom up</option>
          <option value="top-down">top down</option>
        </select>
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
