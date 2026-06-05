<script setup lang="ts">
import Fretboard from './components/Fretboard.vue'
import { ref } from 'vue'

const frets = ref<string[]>([])
const midis = ref<number[]>([])
const notes = ref<string[]>([])
const chord = ref<String>('')

function currentFrets(newFrets: string[]): void {
  frets.value = newFrets
}
function currentMidis(newMidis: number[]): void {
  midis.value = newMidis
}
function currentNotes(newNotes: string[]): void {
  notes.value = newNotes
}
function currentChord(newChord: string): void {
  chord.value = newChord
}
</script>

<template>
  <header>
    <h1>NebyooAxe</h1>
  </header>

  <main>
    <Fretboard
      @current-frets="currentFrets"
      @current-midis="currentMidis"
      @current-notes="currentNotes"
      @current-chord="currentChord"
    />

    <div id="current-frets" :class="{ empty: !frets.length }">
      Frets: {{ frets.length ? frets : '' }}
    </div>
    <div id="current-midis" :class="{ empty: !midis.length }">
      Midis: {{ midis.length ? midis : '' }}
    </div>
    <div id="current-notes" :class="{ empty: !notes.length }">
      Notes: {{ notes.length ? notes : '' }}
    </div>
    <div id="current-chord" :class="{ empty: !chord.length }">Chord: {{ chord ? chord : '' }}</div>
  </main>
</template>

<style scoped>
header {
  display: flex;

  h1 {
    font-weight: 500;
    font-size: 2.6rem;
    position: relative;
    top: -10px;
  }
}

main {
  line-height: 1.5;
}

@media (min-width: 1200px) {
  header {
    place-items: center;
  }
}
</style>
