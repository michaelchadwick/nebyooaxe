<script setup lang="ts">
import { INTERVAL_NAMES } from '@/constants'
import Fret from '@/fret'

const props = defineProps({
  appKey: { type: [String, Number], default: null },
  chord: { type: String, default: '' },
  frets: { type: Array<Fret>, default: () => [] },
  invls: { type: Array<number[]>, default: () => [] },
  midis: { type: Array<number>, default: () => [] },
  notes: { type: Array<string>, default: () => [] },
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

function fretsToTab(frets: Fret[]): string {
  const strings = [1, 2, 3, 4, 5, 6]
  const tabArray = strings.map((stringNum) => {
    const fret = frets.find((f) => f.str === stringNum.toString())
    return fret ? fret.offset : 'x'
  })
  return tabArray.join('')
}
</script>

<template>
  <div id="note-stats" :key="appKey">
    <div id="current-chord" :class="{ empty: !chord.length }">
      <strong>Chord</strong>: {{ chord || '' }}
    </div>
    <div id="current-tab" :class="{ empty: !frets.length }">
      <strong>Tab</strong>: {{ frets.length ? fretsToTab(frets) : '' }}
    </div>

    <details>
      <summary>Details: Frets, Midi, Notes, Intervals</summary>
      <div id="current-frets" :class="{ empty: !frets.length }">
        <strong>Frets</strong>: {{ frets.length ? frets.map((f) => f.toString()).join(', ') : '' }}
      </div>
      <div id="current-midis" :class="{ empty: !midis.length }">
        <strong>Midis</strong>: {{ midis.length ? midis : '' }}
      </div>
      <div id="current-notes" :class="{ empty: !notes.length }">
        <strong>Notes</strong>: {{ notes.length ? notes : '' }}
      </div>
      <div id="current-invls" :class="{ empty: !invls.length }">
        <strong>Intervals (Num)</strong>:
        {{ invls.length ? invlsDisplay(invls) : '' }}
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

  #current-chord,
  #current-tab {
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
