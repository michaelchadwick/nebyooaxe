// src/stores/settings.ts
import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'

type FretArray = string[]
type OscType = 'sine' | 'square' | 'triangle' | 'sawtooth'

export const useSettingsStore = defineStore('nebyooaxe-settings', {
  state: () => ({
    enableFretSound: useStorage('axe-enable-fretSound', true),
    fretSoundType: useStorage('axe-fret-sound-type', 'square' as OscType),
    currentFrets: useStorage('axe-current-frets', <string[]>[]),
  }),
  actions: {
    toggleEnableFretSound() {
      this.enableFretSound = !this.enableFretSound
    },
    updateFretSoundType(type: OscType) {
      this.fretSoundType = type
    },
    updateCurrentFrets(currentFrets: FretArray) {
      this.currentFrets = currentFrets
    },
  },
})
