<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import Note from '@/note'
import type { OscType } from '@/types'
import {
  MUSICAL_NOTES,
  FRET_NOTE,
  NOTE_NAMES_FLAT,
  NOTE_NAMES_SHARP,
  CHORD_PATTERNS,
} from '@/constants'

const settings = useSettingsStore()
const ctx = new window.AudioContext()
const fretsPressed = ref<string[]>([])

const emit = defineEmits([
  'currentFrets',
  'currentMidis',
  'currentNotes',
  'currentInvls',
  'currentChord',
])

type FretArray = string[]
type MidiNote = number
type PitchClass = number
type MidiArray = MidiNote[]
type NoteArray = Note[]
type ChordName = string

function isOscType(v: any): v is OscType {
  return ['sine', 'square', 'triangle', 'sawtooth'].includes(v)
}

function getStringFretsPressed(stringId: string): NodeList | null {
  const frets: NodeList = document.querySelectorAll(
    `.string[data-string-id="${stringId}"] .fret[data-pressed="true"]`,
  )

  return frets ?? null
}

// fret is being pressed or unpressed
// update frets, midis, notes
// try to decipher chord(s)
function toggleFret(event: PointerEvent): void {
  if (event.target instanceof HTMLElement) {
    let elem = event.target

    if (elem) {
      elem.dataset?.pressed == 'false' ? toggleNoteOn(elem) : toggleNoteOff(elem)
    }

    emitNoteStatUpdates()
  }
}

// toggle from unpressed to pressed: add note-bubble
function toggleNoteOn(elem: HTMLElement) {
  const stringId: string | undefined = elem.parentElement?.dataset.stringId
  const fretId: string | undefined = elem.dataset.fretId
  const classes = elem.classList
  const dataset = elem.dataset

  if (stringId && fretId) {
    const stringFretsPressed: NodeList | null = getStringFretsPressed(stringId)

    // remove all other pressed notes
    if (stringFretsPressed && stringFretsPressed.length) {
      stringFretsPressed.forEach((fret: Node) => {
        if (fret instanceof HTMLElement) {
          fret.dataset.pressed = 'false'
          fret.classList.remove('pressed')
          fretsPressed.value = fretsPressed.value.filter(
            (fretPressed) => fretPressed != fret.dataset.fretId,
          )
          if (!fret.classList.contains('open')) {
            fret.classList.add('empty')
          }

          fret.innerHTML = ''
        }
      })
    }
    dataset.pressed = 'true'
    classes?.remove('empty')
    classes?.add('pressed', 'note-bubble')
    fretsPressed.value = [...fretsPressed.value, fretId ?? '']

    if (stringId !== undefined && fretId !== undefined) {
      const noteIndex = Number(fretId.slice(2)) % 12
      if (FRET_NOTE[stringId] !== undefined && FRET_NOTE[stringId][noteIndex] !== undefined) {
        elem.innerHTML = FRET_NOTE[stringId][noteIndex]
      }
    }

    // play note, if sound enabled
    if (settings.enableFretSound) {
      if (fretId) {
        playNote(fretId)
      }
    }
  }
}

// toggle from pressed to unpressed: remove note-bubble
function toggleNoteOff(elem: HTMLElement) {
  const stringId: string | undefined = elem.parentElement?.dataset.stringId
  const fretId: string | undefined = elem.dataset.fretId
  const classes = elem.classList
  const dataset = elem.dataset

  if (stringId && fretId) {
    if (dataset !== undefined) {
      dataset.pressed = 'false'
    }
    classes?.remove('pressed', 'note-bubble')
    fretsPressed.value = fretsPressed.value.filter((fret) => fret != fretId)

    if (!classes.contains('open')) {
      classes.add('empty')
    }
    elem.innerHTML = ''

    // if there are no more frets pressed, make sure to reset ref objects
    if (!fretsPressed.value.length) {
      emitEmpties()
    }
  }
}

function _midiToPitchClass(n: MidiNote): PitchClass {
  return ((n % 12) + 12) % 12
}
function _pitchClassName(pc: PitchClass, useFlat = false): string {
  if (!NOTE_NAMES_FLAT[pc] || !NOTE_NAMES_SHARP[pc]) return ''

  return useFlat ? NOTE_NAMES_FLAT[pc] : NOTE_NAMES_SHARP[pc]
}

function getChord(midiNums: MidiArray, useFlatNotation = true): ChordName[] {
  if (!midiNums || !midiNums.length) return ['']

  if (midiNums.length > 1) {
    const pitchClasses: Set<PitchClass> = new Set(midiNums.map(_midiToPitchClass))
    const possibleChords: ChordName[] = []
    const possibleInvls: number[][] = []

    for (const root of Array.from(pitchClasses)) {
      const intervals = Array.from(pitchClasses)
        .map((pc) => (pc - root + 12) % 12)
        .sort((a, b) => a - b)

      const key = intervals.join(',')
      let chordTypes: string[][] = []
      Object.keys(CHORD_PATTERNS).forEach((patternKey) => {
        if (patternKey == key && CHORD_PATTERNS[key]) {
          chordTypes.push(CHORD_PATTERNS[key])
        }
      })

      possibleInvls.push(intervals)

      if (chordTypes) {
        chordTypes.forEach((type) => {
          const name = _pitchClassName(root, useFlatNotation)
          possibleChords.push(`${name}${type}`)
        })
      }
    }

    emit(
      'currentInvls',
      possibleInvls.map((invl) => invl.join(',')),
    )

    if (!possibleChords.length) {
      const lowestNote = _pitchClassName(_midiToPitchClass(midiNums[0]), useFlatNotation)
      return [`(Unidentified ${lowestNote} ${midiNums.length == 2 ? 'interval' : 'chord'})`]
    }

    return possibleChords
  } else {
    return ['(Need at least 2 notes)']
  }
}

function getNotes(): NoteArray {
  const pressedNotes: HTMLElement[] = Array.from(
    document.querySelectorAll('.fret[data-pressed="true"]'),
  )
  const fretIds: string[] = pressedNotes.map((note: HTMLElement) => note.dataset.fretId ?? '')

  let noteArray: NoteArray = []

  fretIds.forEach((fretId) => {
    MUSICAL_NOTES.forEach((musNote) => {
      if (musNote.fretIds?.includes(fretId)) {
        noteArray.push(musNote)
      }
    })
  })

  return noteArray
}

function playNote(fretId: string): void {
  const masterGainNode = ctx.createGain()
  const startGain = 0.0001
  const endGain = 0.1
  masterGainNode.gain.value = startGain

  // main osc note
  const osc = ctx.createOscillator()
  osc.type = isOscType(settings.fretSoundType) ? settings.fretSoundType : 'square'

  const noteFreq = MUSICAL_NOTES.filter((n) => n.fretIds.includes(fretId))[0]?.frequency
  if (noteFreq) {
    osc.frequency.value = noteFreq
  }

  // vibrato lfo
  const lfo = ctx.createOscillator()
  lfo.type = 'sine'
  lfo.frequency.value = 8

  // gain that sets the depth of the freq mod
  const lfoGain = ctx.createGain()
  lfoGain.gain.value = 0.35
  const lfoDetune = ctx.createGain()
  lfoDetune.gain.value = 50

  // connect lfo to its gain and its detune and then start it
  lfo.connect(lfoGain)
  lfoGain.connect(osc.detune)
  lfo.start()

  // connect main osc to main gain and then to destination
  osc.connect(masterGainNode)
  masterGainNode.connect(ctx.destination)

  // start the main osc, fade in volume, fade out volume, stop main osc
  // add CSS class to element and remove when osc done
  const fretElement = document.querySelector(`[data-fret-id="${fretId}"]`)
  fretElement?.classList.add('playing')
  osc.start(ctx.currentTime)
  masterGainNode.gain.exponentialRampToValueAtTime(endGain, ctx.currentTime + 0.2)
  masterGainNode.gain.exponentialRampToValueAtTime(startGain, ctx.currentTime + 2.1)
  osc.stop(ctx.currentTime + 2.1)
  lfo.stop(ctx.currentTime + 2.1)
  setTimeout(() => fretElement?.classList.remove('playing'), 200)
}
function playChord(fretIds: string[]): void {
  if (fretIds[0]) {
    playNote(fretIds[0])
  }
  let delay = 50
  let index = 1
  fretIds.slice(1).forEach((fretId) => {
    setTimeout(() => playNote(fretId), delay * index)
    index++
  })
}

function resetFrets(): void {
  const strings: string[] = ['6', '5', '4', '3', '2', '1']

  strings.forEach((stringId: string) => {
    const stringFretsPressed: NodeList | null = getStringFretsPressed(stringId)

    // remove all other pressed notes
    if (stringFretsPressed && stringFretsPressed.length) {
      stringFretsPressed.forEach((fret: Node) => {
        if (fret instanceof HTMLElement) {
          fret.dataset.pressed = 'false'
          fret.classList.remove('pressed')
          fretsPressed.value = fretsPressed.value.filter(
            (fretPressed) => fretPressed != fret.dataset.fretId,
          )
          if (!fret.classList.contains('open')) {
            fret.classList.add('empty')
          }

          fret.innerHTML = ''
        }
      })
    }
  })

  emitEmpties()
}

function emitNoteStatUpdates(): void {
  const sortedFrets: FretArray = fretsPressed.value ? [...fretsPressed.value].sort() : []
  settings.currentFrets = sortedFrets
  emit('currentFrets', sortedFrets)

  const noteArray: NoteArray = getNotes()

  const unsortedMidis: MidiArray = noteArray.map((note) => note.midi)
  const sortedMidis: MidiArray = unsortedMidis
    .filter((x): x is number => typeof x === 'number')
    .sort()
  emit('currentMidis', sortedMidis)

  function compareNotes(a: Note, b: Note): number {
    return a.midi - b.midi
  }
  const noteNames: string[] = noteArray
    .sort(compareNotes)
    .map((note) => note.name)
    .filter((x): x is string => !!x)
  emit('currentNotes', noteNames)

  let midiNumberArray: MidiArray = Array.from(
    new Set(noteArray.map((note: Note) => note.midi)),
  ).sort()
  emit('currentChord', getChord(midiNumberArray))
}

// reset all debug collections
function emitEmpties(): void {
  emit('currentFrets', [])
  emit('currentMidis', [])
  emit('currentNotes', [])
  emit('currentInvls', [])
  emit('currentChord', [])

  settings.currentFrets = []
}

async function loadFrets() {
  if (settings.currentFrets) {
    const frets: NodeList = document.querySelectorAll(`.fret`)

    frets.forEach((fret: Node) => {
      if (fret instanceof HTMLElement && fret.dataset.fretId) {
        if (settings.currentFrets.includes(fret.dataset.fretId)) {
          const stringId = fret.parentElement?.dataset.stringId
          const fretId = fret.dataset.fretId

          fret.dataset.pressed = 'true'
          fret.classList.remove('empty')
          fret.classList.add('pressed', 'note-bubble')
          fretsPressed.value = [...fretsPressed.value, fretId ?? '']

          const noteIndex = Number(fretId.slice(2)) % 12

          if (stringId !== undefined && fretId !== undefined) {
            if (FRET_NOTE[stringId] !== undefined && FRET_NOTE[stringId][noteIndex] !== undefined) {
              fret.innerHTML = FRET_NOTE[stringId][noteIndex]
            }
          }
        }
      }
    })

    emitNoteStatUpdates()
    keyboardEventHandler()
  }
}

function keyboardEventHandler(): void {
  document.addEventListener('keyup', keyController)
}
function keyController(e: KeyboardEvent): void {
  switch (e.code) {
    case 'Space':
      playChord(fretsPressed.value)
      break
    case 'Escape':
      resetFrets()
      break
    default:
      break
  }
}

onMounted(loadFrets)
</script>

<template>
  <div id="buttons">
    <div id="play-chord">
      <button @click="playChord(fretsPressed)" :disabled="!fretsPressed.length">Strum Notes</button>
    </div>
    <div id="reset-notes">
      <button @click="resetFrets" :disabled="!fretsPressed.length">Reset Frets</button>
    </div>
  </div>

  <div id="fretboard-viewport">
    <div id="fretboard-numbers">
      <div></div>
      <div>0</div>
      <div>1</div>
      <div>2</div>
      <div>3</div>
      <div>4</div>
      <div>5</div>
      <div>6</div>
      <div>7</div>
      <div>8</div>
      <div>9</div>
      <div>10</div>
      <div>11</div>
      <div>12</div>
      <div>13</div>
      <div>14</div>
      <div>15</div>
      <div>16</div>
      <div>17</div>
      <div>18</div>
      <div>19</div>
      <div>20</div>
      <div>21</div>
      <div>22</div>
      <div>23</div>
      <div>24</div>
    </div>

    <div id="fretboard">
      <div id="string-notes">
        <div data-string-note-id="6">E<sub>4</sub></div>
        <div data-string-note-id="5">B<sub>3</sub></div>
        <div data-string-note-id="4">G<sub>3</sub></div>
        <div data-string-note-id="3">D<sub>3</sub></div>
        <div data-string-note-id="2">A<sub>2</sub></div>
        <div data-string-note-id="1">E<sub>2</sub></div>
      </div>

      <div id="strings">
        <div class="string" data-string-id="6" data-note-id="E">
          <div class="fret open" @click="toggleFret" data-pressed="false" data-fret-id="6_0"></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="6_1"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="6_2"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="6_3"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="6_4"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="6_5"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="6_6"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="6_7"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="6_8"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="6_9"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="6_10"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="6_11"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="6_12"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="6_13"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="6_14"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="6_15"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="6_16"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="6_17"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="6_18"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="6_19"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="6_20"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="6_21"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="6_22"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="6_23"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="6_24"
          ></div>
        </div>
        <div class="string" data-string-id="5" data-note-id="B">
          <div class="fret open" @click="toggleFret" data-pressed="false" data-fret-id="5_0"></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="5_1"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="5_2"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="5_3"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="5_4"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="5_5"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="5_6"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="5_7"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="5_8"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="5_9"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="5_10"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="5_11"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="5_12"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="5_13"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="5_14"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="5_15"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="5_16"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="5_17"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="5_18"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="5_19"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="5_20"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="5_21"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="5_22"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="5_23"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="5_24"
          ></div>
        </div>
        <div class="string" data-string-id="4" data-note-id="G">
          <div class="fret open" @click="toggleFret" data-pressed="false" data-fret-id="4_0"></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="4_1"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="4_2"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="4_3"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="4_4"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="4_5"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="4_6"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="4_7"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="4_8"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="4_9"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="4_10"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="4_11"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="4_12"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="4_13"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="4_14"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="4_15"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="4_16"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="4_17"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="4_18"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="4_19"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="4_20"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="4_21"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="4_22"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="4_23"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="4_24"
          ></div>
        </div>
        <div class="string" data-string-id="3" data-note-id="D">
          <div class="fret open" @click="toggleFret" data-pressed="false" data-fret-id="3_0"></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="3_1"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="3_2"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="3_3"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="3_4"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="3_5"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="3_6"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="3_7"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="3_8"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="3_9"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="3_10"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="3_11"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="3_12"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="3_13"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="3_14"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="3_15"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="3_16"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="3_17"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="3_18"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="3_19"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="3_20"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="3_21"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="3_22"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="3_23"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="3_24"
          ></div>
        </div>
        <div class="string" data-string-id="2" data-note-id="A">
          <div class="fret open" @click="toggleFret" data-pressed="false" data-fret-id="2_0"></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="2_1"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="2_2"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="2_3"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="2_4"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="2_5"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="2_6"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="2_7"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="2_8"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="2_9"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="2_10"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="2_11"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="2_12"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="2_13"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="2_14"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="2_15"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="2_16"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="2_17"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="2_18"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="2_19"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="2_20"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="2_21"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="2_22"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="2_23"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="2_24"
          ></div>
        </div>
        <div class="string" data-string-id="1" data-note-id="E">
          <div
            class="fret open"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="1_0"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="1_1"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="1_2"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="1_3"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="1_4"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="1_5"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="1_6"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="1_7"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="1_8"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="1_9"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="1_10"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="1_11"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="1_12"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="1_13"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="1_14"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="1_15"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="1_16"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="1_17"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="1_18"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="1_19"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="1_20"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="1_21"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="1_22"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="1_23"
          ></div>
          <div
            class="fret empty"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="1_24"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
#buttons {
  display: flex;
  gap: 5px;
  justify-content: center;
  padding-bottom: 1em;
}

#fretboard-viewport {
  overflow-x: visible;

  @media (max-width: 768px) {
    overflow-x: scroll;
    max-width: 90vw;
  }
}

#fretboard-numbers {
  display: flex;
  font-size: 1rem;

  div {
    font-weight: 700;
    margin: 0;
    padding: 0.3em 0;
    text-align: center;
    width: 1.75rem;
    writing-mode: sideways-lr;
  }

  @media (max-width: 768px) {
    display: -webkit-box;
    width: 100%;
  }
}

#fretboard {
  display: flex;
  flex-direction: row;

  #string-notes {
    align-items: center;
    border: 2px solid var(--vt-c-black-true);
    display: flex;
    flex-direction: column;
    font-size: 1rem;
    font-weight: 700;
    margin-top: 0;
    padding: 0 0.5em;
    width: 1.75rem;

    div {
      align-items: center;
      display: flex;
      height: 1.75rem;
    }
  }

  #strings {
    border-bottom: 2px solid var(--vt-c-black-true);
    border-top: 2px solid var(--vt-c-black-true);
  }

  .string {
    align-items: center;
    display: flex;
    height: 1.75rem;

    &:last-of-type {
      border-bottom: 0;
    }

    .fret {
      align-items: center;
      border-right: 2px solid var(--vt-c-black-true);
      display: flex;
      justify-content: center;
      padding: 0;
      position: relative;
      height: 1.75rem;
      transition: all 100ms;
      width: 1.75rem;

      &.empty::after {
        content: '';
        display: block;
        width: 100%;
        height: 2px;
        background: var(--vt-c-gray-dark);
        position: absolute;
        top: 50%;
        left: 0;
        transform: translateY(-50%);
      }

      @media (hover: hover) {
        &:hover {
          background: var(--vt-c-yellow);
          border-right: 2px solid var(--vt-c-orange);
          cursor: pointer;
        }
      }

      &.pressed,
      &.pressed:hover {
        background-color: var(--vt-c-green);
        border-right: 2px solid var(--vt-c-green-dark);
        border: none;

        &.note-bubble {
          border: 10px var(--vt-c-green-dark);
          border-right: 2px solid var(--vt-c-black);
          border-radius: 16px;
          color: var(--vt-c-black);
          height: 28px;
          transition: all 100ms;
          width: 28px;
          z-index: 10;

          &.playing {
            background-color: var(--vt-c-orange);
          }

          @media (hover: hover) {
            &:hover {
              background-color: var(--vt-c-yellow);
              border-color: var(--vt-c-yellow);
              border-right: 2px solid var(--vt-c-black);
            }
          }
        }
      }

      &:first-of-type {
        border-left: 1px solid var(--vt-c-gray);
        border-right: none;
        border-top: none;
      }
      &:nth-of-type(1) {
        border-left: none;
      }
      &:nth-of-type(2) {
        border-left: 2px solid var(--vt-c-black-true);
      }
    }
  }
}
</style>
