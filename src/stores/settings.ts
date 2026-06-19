// src/stores/settings.ts
import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'

type FretArray = string[]

export const useSettingsStore = defineStore('nebyooaxe-settings', {
  state: () => ({
    enableFretSound: useStorage('enableFretSound', true),
    currentFrets: useStorage('currentFrets', <string[]>[]),
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
