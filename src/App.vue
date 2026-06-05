<script setup lang="ts">
import Fretboard from './components/Fretboard.vue'
import { ref } from 'vue'

type FretArray = string[]
type PitchClass = number
type IntervalsArray = number[][]
type MidiArray = number[]
type NoteArray = string[]
type ChordName = string

const frets = ref<FretArray>([])
const midis = ref<MidiArray>([])
const notes = ref<NoteArray>([])
const invls = ref<IntervalsArray>([])
const chord = ref<ChordName>('')

function currentFrets(newFrets: FretArray): void {
  frets.value = newFrets
}
function currentMidis(newMidis: MidiArray): void {
  midis.value = newMidis
}
function currentNotes(newNotes: NoteArray): void {
  notes.value = newNotes
}
function currentInvls(newInvls: IntervalsArray): void {
  invls.value = newInvls
}
function currentChord(newChord: ChordName[]): void {
  chord.value = newChord.join(', ')
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
      @current-invls="currentInvls"
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
    <div id="current-invls" :class="{ empty: !invls.length }">
      Intervals: {{ invls.length ? invls : '' }}
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
