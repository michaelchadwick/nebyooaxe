<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import Note from '@/note'
import type { OscType, StrumPattern } from '@/types'
import {
  MUSICAL_NOTES,
  FRET_NOTE,
  NOTE_NAMES_FLAT,
  NOTE_NAMES_SHARP,
  CHORD_PATTERNS,
} from '@/constants'
import Fret from '@/fret'

const settings = useSettingsStore()
const ctx = new window.AudioContext()
const fretsPressed = ref<Fret[]>([])

const emit = defineEmits([
  'currentChord',
  'currentFrets',
  'currentInvls',
  'currentMidis',
  'currentNotes',
])

type ChordName = string
type MidiArray = MidiNote[]
type MidiNote = number
type NoteArray = Note[]
type PitchClass = number

/* ------------------------------------------------------------------ */
/* --- helpers ------------------------------------------------------ */
/* ------------------------------------------------------------------ */
function isOscType(v: any): v is OscType {
  return ['sine', 'square', 'triangle', 'sawtooth'].includes(v)
}
function isStrumPattern(v: any): v is StrumPattern {
  return ['as-entered', 'bottom-up', 'top-down'].includes(v)
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
    const elem = event.target

    elem.dataset?.pressed == 'false' ? toggleNoteOn(elem) : toggleNoteOff(elem)
  }
  emitNoteStatUpdates()
}

// unpress all frets on a string
function clearString(stringId: string): void {
  const stringFretsPressed: NodeList | null = getStringFretsPressed(stringId)

  if (stringFretsPressed && stringFretsPressed.length) {
    stringFretsPressed.forEach((fret: Node) => {
      if (fret instanceof HTMLElement) {
        fret.dataset.pressed = 'false'
        fret.classList.remove('pressed')
        fretsPressed.value = fretsPressed.value.filter((f) => f.toString() != fret.dataset.fretId)
        if (!fret.classList.contains('open')) {
          fret.classList.add('empty')
        }

        fret.innerHTML = ''
      }
    })
  }
}

// toggle from unpressed to pressed: add note-bubble
function toggleNoteOn(elem: HTMLElement) {
  const stringId: string | undefined = elem.parentElement?.dataset.stringId
  const fretId: string | undefined = elem.dataset.fretId

  if (stringId && fretId) {
    clearString(stringId)

    elem.dataset.pressed = 'true'
    elem.classList?.remove('empty')
    elem.classList?.add('pressed', 'note-bubble')

    const offset = fretId.slice(2)
    fretsPressed.value = [...fretsPressed.value, new Fret(stringId, offset)]

    if (stringId !== undefined && fretId !== undefined) {
      const noteIndex = Number(fretId.slice(2)) % 12
      if (FRET_NOTE[stringId]?.[noteIndex]) {
        elem.innerHTML = FRET_NOTE[stringId][noteIndex]
      }
    }

    // play note, if sound enabled
    if (settings.enableFretSound) {
      playNote(fretId)
    }
  }
}

// toggle from pressed to unpressed: remove note-bubble
function toggleNoteOff(elem: HTMLElement) {
  const stringId: string | undefined = elem.parentElement?.dataset.stringId
  const fretId: string | undefined = elem.dataset.fretId

  if (stringId && fretId) {
    if (elem.dataset !== undefined) {
      elem.dataset.pressed = 'false'
    }
    elem.classList?.remove('pressed', 'pressed-hover', 'note-bubble')
    fretsPressed.value = fretsPressed.value.filter((f) => f.toString() !== fretId)

    if (!elem.classList.contains('open')) {
      elem.classList.add('empty')
    }
    elem.innerHTML = ''

    // if there are no more frets pressed, make sure to reset ref objects
    if (!fretsPressed.value.length) {
      emitEmpties()
    }
  }
}

/* ------------------------------------------------------------------ */
/* --- chord / note helpers ----------------------------------------- */
/* ------------------------------------------------------------------ */
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

    emit('currentInvls', possibleInvls)

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

  const noteArray: NoteArray = []

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
function playChord(frets: Fret[]): void {
  const fretIds = frets.map((f) => f.toString())
  let fretsToPlay: string[] = []

  if (isStrumPattern(settings.strumPattern)) {
    switch (settings.strumPattern) {
      case 'bottom-up':
        fretsToPlay = fretIds.sort()
        break
      case 'top-down':
        fretsToPlay = fretIds.sort().reverse()
        break
      default:
        fretsToPlay = fretIds
        break
    }
  } else {
    fretsToPlay = fretIds
  }

  if (fretsToPlay[0]) {
    playNote(fretsToPlay[0])
  }
  let delay = settings.strumDelay
  let index = 1
  fretsToPlay.slice(1).forEach((fretId) => {
    setTimeout(() => playNote(fretId), delay * index)
    index++
  })
}

function moveNotes(fretsToMove: Fret[], mod: number): void {
  const atMin = fretsToMove.filter((f) => f.offset === '0').length
  const atMax = fretsToMove.filter((f) => f.offset === settings.fretCount.toString()).length

  if ((atMin == 0 && mod == -1) || (atMax == 0 && mod == 1)) {
    const fretsToPressMap = new Map<string, Fret>()

    fretsToMove.forEach((f) => {
      const newOffset = (parseInt(f.offset, 10) + mod).toString()
      const newFret = new Fret(f.str, newOffset)
      fretsToPressMap.set(newFret.toString(), newFret)
    })

    const allFrets: NodeList = document.querySelectorAll(`.fret`)

    allFrets.forEach((fret: Node) => {
      if (fret instanceof HTMLElement && fret.dataset.fretId) {
        if (fretsToPressMap.has(fret.dataset.fretId)) {
          const stringId = fret.parentElement?.dataset.stringId

          if (stringId) {
            clearString(stringId)
          }

          fret.dataset.pressed = 'true'
          fret.classList.remove('empty')
          fret.classList.add('pressed', 'note-bubble')
          fretsPressed.value = [...fretsPressed.value, fretsToPressMap.get(fret.dataset.fretId)!]

          const noteIndex = Number(fret.dataset.fretId!.slice(2)) % 12

          if (stringId) {
            if (FRET_NOTE[stringId]?.[noteIndex]) {
              fret.innerHTML = FRET_NOTE[stringId][noteIndex]
            }
          }
        }
      }
    })

    emitNoteStatUpdates()
  }
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
            (f) => f.toString() !== fret.dataset.fretId,
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
  const sortedFrets: Fret[] = [...fretsPressed.value].sort((a, b) =>
    a.toString().localeCompare(b.toString()),
  )
  const fretsToStore = Array.from(new Set(sortedFrets.map((f) => f.toString())))

  settings.currentFrets = fretsToStore
  emit('currentFrets', fretsToStore)

  const noteArray: NoteArray = getNotes()

  const unsortedMidis: MidiArray = noteArray.map((note) => note.midi)
  const sortedMidis: MidiArray = unsortedMidis
    .filter((x): x is number => typeof x === 'number')
    .sort()
  emit('currentMidis', sortedMidis)

  const noteNames: string[] = noteArray
    .sort((a, b) => a.midi - b.midi)
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
    const allFrets: NodeList = document.querySelectorAll('.fret')
    const storedFrets = settings.currentFrets || []

    allFrets.forEach((fret: Node) => {
      if (fret instanceof HTMLElement && fret.dataset.fretId) {
        if (storedFrets.includes(fret.dataset.fretId)) {
          const stringId = fret.parentElement?.dataset.stringId
          const fretId = fret.dataset.fretId

          fret.dataset.pressed = 'true'
          fret.classList.remove('empty')
          fret.classList.add('pressed', 'note-bubble')
          fretsPressed.value = [...fretsPressed.value, Fret.fromString(fretId)]

          const noteIndex = Number(fretId.slice(2)) % 12

          if (stringId) {
            if (FRET_NOTE[stringId]?.[noteIndex]) {
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

function mouseHandler(event: MouseEvent): void {
  if (event.target instanceof HTMLElement) {
    let elem = event.target
    const type = event.type

    if (elem) {
      const stringId: string | undefined = elem.parentElement?.dataset.stringId
      const fretId: string | undefined = elem.dataset.fretId
      const classes = elem.classList
      const pressed = elem.dataset?.pressed

      if (type == 'mouseover') {
        if (pressed == 'false' && fretId !== undefined) {
          classes?.remove('empty')
          classes?.add('pressed', 'pressed-hover', 'note-bubble')
          fretsPressed.value = [...fretsPressed.value, Fret.fromString(fretId)]

          if (stringId !== undefined && fretId !== undefined) {
            const noteIndex = Number(fretId.slice(2)) % 12
            if (FRET_NOTE[stringId] !== undefined && FRET_NOTE[stringId][noteIndex] !== undefined) {
              elem.innerHTML = FRET_NOTE[stringId][noteIndex]
            }
          }
        }
      } else if (elem.dataset?.pressed == 'false') {
        toggleNoteOff(elem)
      }
    }
  }
}

onMounted(loadFrets)
</script>

<template>
  <div id="buttons">
    <div id="lower-notes">
      <button
        @click="moveNotes(fretsPressed, -1)"
        :disabled="!fretsPressed.length"
        title="Move Notes Left"
      >
        <
      </button>
    </div>
    <div id="play-chord">
      <button @click="playChord(fretsPressed)" :disabled="!fretsPressed.length">Strum Notes</button>
    </div>
    <div id="reset-notes">
      <button @click="resetFrets" :disabled="!fretsPressed.length">Reset Frets</button>
    </div>
    <div id="raise-notes">
      <button
        @click="moveNotes(fretsPressed, 1)"
        :disabled="!fretsPressed.length"
        title="Move Notes Right"
      >
        >
      </button>
    </div>
  </div>

  <div id="fretboard-viewport">
    <div id="fretboard-numbers">
      <div></div>
      <div>0</div>
      <div v-for="index in settings.fretCount">{{ index }}</div>
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

      <div id="strings" v-on:mouseover="mouseHandler" v-on:mouseout="mouseHandler">
        <div class="string" data-string-id="6" data-note-id="E">
          <div class="fret open" @click="toggleFret" data-pressed="false" data-fret-id="6_0"></div>
          <template v-for="index in settings.fretCount" :key="index">
            <div
              class="fret empty"
              @click="toggleFret"
              :data-pressed="false"
              :data-note-id="''"
              :data-fret-id="`6_${index}`"
            ></div>
          </template>
        </div>
        <div class="string" data-string-id="5" data-note-id="B">
          <div class="fret open" @click="toggleFret" data-pressed="false" data-fret-id="5_0"></div>
          <template v-for="index in settings.fretCount" :key="index">
            <div
              class="fret empty"
              @click="toggleFret"
              :data-pressed="false"
              :data-note-id="''"
              :data-fret-id="`5_${index}`"
            ></div>
          </template>
        </div>
        <div class="string" data-string-id="4" data-note-id="G">
          <div class="fret open" @click="toggleFret" data-pressed="false" data-fret-id="4_0"></div>
          <template v-for="index in settings.fretCount" :key="index">
            <div
              class="fret empty"
              @click="toggleFret"
              :data-pressed="false"
              :data-note-id="''"
              :data-fret-id="`4_${index}`"
            ></div>
          </template>
        </div>
        <div class="string" data-string-id="3" data-note-id="D">
          <div class="fret open" @click="toggleFret" data-pressed="false" data-fret-id="3_0"></div>
          <template v-for="index in settings.fretCount" :key="index">
            <div
              class="fret empty"
              @click="toggleFret"
              :data-pressed="false"
              :data-note-id="''"
              :data-fret-id="`3_${index}`"
            ></div>
          </template>
        </div>
        <div class="string" data-string-id="2" data-note-id="A">
          <div class="fret open" @click="toggleFret" data-pressed="false" data-fret-id="2_0"></div>
          <template v-for="index in settings.fretCount" :key="index">
            <div
              class="fret empty"
              @click="toggleFret"
              :data-pressed="false"
              :data-note-id="''"
              :data-fret-id="`2_${index}`"
            ></div>
          </template>
        </div>
        <div class="string" data-string-id="1" data-note-id="E">
          <div
            class="fret open"
            @click="toggleFret"
            data-pressed="false"
            data-note-id=""
            data-fret-id="1_0"
          ></div>
          <template v-for="index in settings.fretCount" :key="index">
            <div
              class="fret empty"
              @click="toggleFret"
              :data-pressed="false"
              :data-note-id="''"
              :data-fret-id="`1_${index}`"
            ></div>
          </template>
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
  padding-bottom: 0.5rem;

  button {
    height: auto;
  }
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
    border-bottom: 2px solid var(--color-border);
    border-top: 2px solid var(--color-border);
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
