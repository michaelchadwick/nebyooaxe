// src/stores/settings.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSettingsStore = defineStore('settings', () => {
  // settings
  const enableFretSound = ref(true)

  // change settings
  function toggle(setting: string) {
    switch (setting) {
      case 'enableFretSound':
        enableFretSound.value = !enableFretSound.value
        break
      default:
        break
    }
  }

  return { enableFretSound, toggle }
})
