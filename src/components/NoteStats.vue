<script setup lang="ts">
import { INTERVAL_NAMES } from '@/constants'

const props = defineProps({
  appKey: { type: [String, Number], default: null },
  chord: { type: String, default: '' },
  frets: { type: Array<string>, default: () => [] },
  midis: { type: Array<number>, default: () => [] },
  notes: { type: Array<string>, default: () => [] },
  invls: { type: Array<number[]>, default: () => [] },
})

function invlsDisplay(invlGroups: number[][]) {
  const numberGroups: string[] = []

  invlGroups.forEach((invlGroup: number[]) => {
    numberGroups.push(invlGroup.join(','))
  })

  return numberGroups
}

function iNumsToLbls(invlGroups: number[][]): string[] {
  const labelGroups: string[] = []

  invlGroups.forEach((invlGroup: number[]) => {
    const labelString = invlGroup.map((invl: number) => {
      return INTERVAL_NAMES[invl]
    })
    labelGroups.push(labelString.join(','))
  })

  return labelGroups
}
</script>

<template>
  <div id="note-stats" :key="appKey">
    <div id="current-chord" :class="{ empty: !chord.length }">
      <strong>Chord</strong>: {{ chord || '' }}
    </div>

    <details>
      <summary>Details: Frets, Midi, Notes, Intervals</summary>
      <div id="current-frets" :class="{ empty: !frets.length }">
        <strong>Frets</strong>: {{ frets.length ? frets : '' }}
      </div>
      <div id="current-midis" :class="{ empty: !midis.length }">
        <strong>Midis</strong>: {{ midis.length ? midis : '' }}
      </div>
      <div id="current-notes" :class="{ empty: !notes.length }">
        <strong>Notes</strong>: {{ notes.length ? notes : '' }}
      </div>
      <div id="current-invls" :class="{ empty: !invls.length }">
        <strong>Intervals (Num)</strong>: {{ invls.length ? invlsDisplay(invls) : '' }}
      </div>
      <div id="current-ilbls" :class="{ empty: !invls.length }">
        <strong>Intervals (Lbl)</strong>:
        {{ invls.length ? iNumsToLbls(invls) : '' }}
      </div>
    </details>
  </div>
</template>

<style scoped>
#note-stats {
  font-size: 0.9rem;
  line-height: 1.2;
  padding-top: 5px;

  @media (min-width: 1200px) {
    font-size: 1rem;
  }

  #current-chord {
    font-size: 1rem;
    margin-bottom: 0.5rem;

    @media (min-width: 1200px) {
      font-size: 1.2rem;
    }
  }

  details {
    cursor: pointer;

    @media (hover: hover) {
      summary:hover {
        text-decoration: underline;
      }
    }

    div#current-ilbls {
      white-space: break-spaces;
    }
  }
}
</style>
