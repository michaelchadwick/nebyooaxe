<script setup lang="ts">
import Fretboard from './components/Fretboard.vue'
import { ref } from 'vue'

const appKey = ref(0)

const forceRerender = () => {
  appKey.value++
}

type FretArray = string[]
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
    <h1>Nebyoo<strong>Axe</strong></h1>
  </header>

  <main>
    <Fretboard
      :key="appKey"
      @current-frets="currentFrets"
      @current-midis="currentMidis"
      @current-notes="currentNotes"
      @current-invls="currentInvls"
      @current-chord="currentChord"
    />

    <div id="note-stats" :key="appKey">
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
        <strong>Intervals</strong>: {{ invls.length ? invls : '' }}
      </div>
      <div id="current-chord" :class="{ empty: !chord.length }">
        <strong>Chord</strong>: {{ chord ? chord : '' }}
      </div>
    </div>
  </main>

  <footer id="footer-neb-host">site by <a href="https://neb.host">neb.host</a></footer>
</template>

<style scoped>
header {
  display: flex;

  h1 {
    font-weight: 500;
    font-size: 2.6rem;
    position: relative;
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

footer {
  background: var(--vt-c-black-softer);
  border-top: 2px solid var(--vt-c-black-true);
  bottom: 0;
  color: var(--vt-c-white);
  font-family: 'Consolas', sans-serif;
  font-size: 12px;
  font-weight: 500;
  height: 40px;
  left: 0;
  letter-spacing: initial;
  margin-top: 20px;
  padding: 10px 18px;
  position: absolute;
  right: 0;
  text-align: left;
  z-index: 2;
}
</style>
