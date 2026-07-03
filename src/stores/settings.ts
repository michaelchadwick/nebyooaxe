// src/stores/settings.ts
import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'

type FretArray = string[]

export const useSettingsStore = defineStore('nebyooaxe-settings', {
  state: () => ({
    enableFretSound: useStorage('axe-enable-fretSound', true),
    currentFrets: useStorage('axe-current-frets', <string[]>[]),
  }),
  actions: {
    toggleEnableFretSound() {
      this.enableFretSound = !this.enableFretSound
    },
    updateCurrentFrets(currentFrets: FretArray) {
      this.currentFrets = currentFrets
    },
  },
})
