// src/stores/settings.ts
import { defineStore } from 'pinia'

export const useSettingsStore = defineStore('nebyooaxe-settings', {
  persist: true,
  state: () => ({
    enableFretSound: true,
  }),
  actions: {
    toggle(setting: string) {
      switch (setting) {
        case 'enabledFretSound':
          this.enableFretSound = !this.enableFretSound
          break
        default:
          break
      }
    },
  },
})
