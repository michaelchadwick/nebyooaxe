<script setup lang="ts">
import { useSettingsStore } from '@/stores/settings'
import { onMounted, ref } from 'vue'
import Header from './components/Header.vue'
import Fretboard from './components/Fretboard.vue'
import NoteStats from './components/NoteStats.vue'
import Modal from '@/components/Modal.vue'

const appKey = ref(0)

const forceRerender = () => {
  appKey.value++
}

type FretArray = string[]
type IntervalsArray = number[][]
type MidiArray = number[]
type NoteArray = string[]
type ChordName = string

const chord = ref<ChordName>('')
const frets = ref<FretArray>([])
const midis = ref<MidiArray>([])
const notes = ref<NoteArray>([])
const invls = ref<IntervalsArray>([])

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

onMounted(() => {
  const env = ['axe.neb.host', 'neb.host'].includes(document.location.hostname) ? 'prod' : 'local'

  if (env == 'local') {
    if (!document.title.includes('(LH)')) {
      document.title = '(LH) ' + document.title
    }
  }
})
</script>

<template>
  <Header />

  <main>
    <Fretboard
      :key="appKey"
      @current-frets="currentFrets"
      @current-midis="currentMidis"
      @current-notes="currentNotes"
      @current-invls="currentInvls"
      @current-chord="currentChord"
    />

    <NoteStats
      :chord="chord"
      :frets="frets"
      :midis="midis"
      :notes="notes"
      :invls="invls"
      :app-key="appKey"
      :key="appKey"
    />
  </main>

  <Modal />
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
  display: block;
  line-height: 1.5;
  margin-top: 50px;
  z-index: 1;
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
  height: 20px;
  left: 0;
  letter-spacing: initial;
  margin: 20px 0 0;
  padding: 0 10px;
  position: fixed;
  right: 0;
  text-align: left;
  width: 100vw;
  z-index: 2;
}
</style>
