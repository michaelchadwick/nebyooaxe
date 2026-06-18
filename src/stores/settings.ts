// src/stores/settings.ts
import { defineStore } from 'pinia'

type FretArray = string[]

export const useSettingsStore = defineStore('nebyooaxe-settings', {
  persist: true,
  state: () => ({
    enableFretSound: true,
    currentFrets: <string[]>[],
  }),
  actions: {
    toggleEnableFretSound() {
      this.enableFretSound = !this.enableFretSound
    },
    updateCurrentFrets(currentFrets: FretArray) {
      console.log('currentFrets', currentFrets)
      this.currentFrets = currentFrets
    },
  },
})
