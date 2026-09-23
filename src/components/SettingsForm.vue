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
      <fieldset>
        <div class="settings-row">
          <label> Fret Count </label>
          <span>
            <input v-model="settings.fretCount" type="number" min="12" max="24" />
          </span>
        </div>

        <div class="settings-row">
          <label> Enable Fret Sound </label>
          <span>
            <input
              type="checkbox"
              :checked="settings.enableFretSound"
              @change="updateEnableFretSound"
            />
          </span>
        </div>

        <div class="settings-row">
          <label> Fret Sound Type </label>
          <span>
            <select v-model="settings.fretSoundType">
              <option value="sine">sine</option>
              <option value="square">square</option>
              <option value="sawtooth">sawtooth</option>
              <option value="triangle">triangle</option>
            </select>
          </span>
        </div>

        <div class="settings-row">
          <label> Strum Pattern </label>
          <span>
            <select v-model="settings.strumPattern">
              <option value="as-entered">as entered</option>
              <option value="bottom-up">bottom up</option>
              <option value="top-down">top down</option>
            </select>
          </span>
        </div>
      </fieldset>
    </div>
  </div>
</template>

<style scoped>
.settings-form {
  display: flex;
  flex-direction: column;

  fieldset {
    border: 1px solid var(--color-border);
    padding: 0.25rem;
  }

  .settings-row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    label {
      background-color: var(--color-background);
      font-weight: bold;
    }

    span {
      background-color: var(--color-background-mute);
      display: inline-block;
      min-width: 100px;
      padding: 0.1em;
    }
  }
}
</style>
