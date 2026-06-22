<script setup lang="ts">
import { useSettingsStore } from '@/stores/settings'
import { onMounted, ref } from 'vue'
import Header from './components/Header.vue'
import Fretboard from './components/Fretboard.vue'
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

#note-stats {
  font-size: 0.9rem;
  line-height: 1.2;
  padding-top: 5px;

  @media (min-width: 1200px) {
    font-size: 1rem;
  }
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
