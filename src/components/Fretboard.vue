<script setup lang="ts">
import { ref } from 'vue'

const fretsPressed = ref<string[]>([])

const emit = defineEmits([
  'currentFrets',
  'currentMidis',
  'currentNotes',
  'currentInvls',
  'currentChord',
])

class Note {
  name: string
  frequency: number
  midi: number
  fretIds: string[]

  constructor(name: string, frequency: number, midi: number, fretIds: string[] = []) {
    this.name = name
    this.frequency = frequency
    this.midi = midi
    this.fretIds = fretIds
  }
}
type FretArray = string[]
type MidiNote = number
type PitchClass = number
type IntervalsArray = number[]
type MidiArray = MidiNote[]
type NoteArray = Note[]
type ChordName = string

/*
Switch from arbitrary object to Note
\{

  name: '([A-Za-z0-9]{2,3})',
  frequency: ([0-9]{2,4}\.[0-9]{1,2}),
  midi: ([0-9]{2,3})
  (, fretIds:
    \[{1}
      ('[0-9]+_[0-9]+'){1}
      (, '[0-9]+_[0-9]+')*
    \]{1}
  )?

\},
*/

const MUSICAL_NOTES: Note[] = [
  // index 0
  new Note('C0', 16.35, 12),
  new Note('Db0', 17.32, 13),
  new Note('D0', 18.35, 14),
  new Note('Eb0', 19.45, 15),
  new Note('E0', 20.6, 16),
  new Note('F0', 21.83, 17),
  new Note('Gb0', 23.12, 18),
  new Note('G0', 24.5, 19),
  new Note('Ab0', 25.96, 20),
  new Note('A0', 27.5, 21),
  new Note('Bb0', 29.14, 22),
  new Note('B0', 30.87, 23),
  // index 12
  new Note('C1', 32.7, 24),
  new Note('Db1', 34.65, 25),
  new Note('D1', 36.71, 26),
  new Note('Eb1', 38.89, 27),
  new Note('E1', 41.2, 28),
  new Note('F1', 43.65, 29),
  new Note('Gb1', 46.25, 30),
  new Note('G1', 49.0, 31),
  new Note('Ab1', 51.91, 32),
  new Note('A1', 55.0, 33),
  new Note('Bb1', 58.27, 34),
  new Note('B1', 61.74, 35),
  // index 24
  new Note('C2', 65.41, 36),
  new Note('Db2', 69.3, 37),
  new Note('D2', 73.42, 38),
  new Note('Eb2', 77.78, 39),
  new Note('E2', 82.41, 40, ['1_0']),
  new Note('F2', 87.31, 41, ['1_1']),
  new Note('Gb2', 92.5, 42, ['1_2']),
  new Note('G2', 98.0, 43, ['1_3']),
  new Note('Ab2', 103.83, 44, ['1_4']),
  new Note('A2', 110.0, 45, ['1_5', '2_0']),
  new Note('Bb2', 116.54, 46, ['1_6', '2_1']),
  new Note('B2', 123.47, 47, ['1_7', '2_2']),
  // index 36
  new Note('C3', 130.81, 48, ['1_8', '2_3']),
  new Note('Db3', 138.59, 49, ['1_9', '2_4']),
  new Note('D3', 146.83, 50, ['1_10', '2_5', '3_0']),
  new Note('Eb3', 155.56, 51, ['1_11', '2_6', '3_1']),
  new Note('E3', 164.81, 52, ['1_12', '2_7', '3_2']),
  new Note('F3', 174.61, 53, ['1_13', '2_8', '3_3']),
  new Note('Gb3', 185.0, 54, ['1_14', '2_9', '3_4']),
  new Note('G3', 196.0, 55, ['1_15', '2_10', '3_5', '4_0']),
  new Note('Ab3', 207.65, 56, ['1_16', '2_11', '3_6', '4_1']),
  new Note('A3', 220.0, 57, ['1_17', '2_12', '3_7', '4_2']),
  new Note('Bb3', 233.08, 58, ['1_18', '2_13', '3_8', '4_3']),
  new Note('B3', 246.94, 59, ['1_19', '2_14', '3_9', '4_4', '5_0']),
  // index 48
  new Note('C4', 261.63, 60, ['1_20', '2_15', '3_10', '4_5', '5_1']),
  new Note('Db4', 277.18, 61, ['1_21', '2_16', '3_11', '4_6', '5_2']),
  new Note('D4', 293.66, 62, ['1_22', '2_17', '3_12', '4_7', '5_3']),
  new Note('Eb4', 311.13, 63, ['1_23', '2_18', '3_13', '4_8', '5_4']),
  new Note('E4', 329.63, 64, ['1_24', '2_19', '3_14', '4_9', '5_5', '6_0']),
  new Note('F4', 349.23, 65, ['2_20', '3_15', '4_10', '5_6', '6_1']),
  new Note('Gb4', 369.99, 66, ['2_21', '3_16', '4_11', '5_7', '6_2']),
  new Note('G4', 392.0, 67, ['2_22', '3_17', '4_12', '5_8', '6_3']),
  new Note('Ab4', 415.3, 68, ['2_23', '3_18', '4_13', '5_9', '6_4']),
  new Note('A4', 440.0, 69, ['2_24', '3_19', '4_14', '5_10', '6_5']),
  new Note('Bb4', 466.16, 70, ['3_20', '4_15', '5_11', '6_6']),
  new Note('B4', 493.88, 71, ['3_21', '4_16', '5_12', '6_7']),
  // index 60
  new Note('C5', 523.25, 72, ['3_22', '4_17', '5_13', '6_8']),
  new Note('Db5', 554.37, 73, ['3_23', '4_18', '5_14', '6_9']),
  new Note('D5', 587.33, 74, ['3_24', '4_19', '5_15', '6_10']),
  new Note('Eb5', 622.25, 75, ['4_20', '5_16', '6_11']),
  new Note('E5', 659.25, 76, ['4_21', '5_17', '6_12']),
  new Note('F5', 698.46, 77, ['4_22', '5_18', '6_13']),
  new Note('Gb5', 739.99, 78, ['4_23', '5_19', '6_14']),
  new Note('G5', 783.99, 79, ['4_24', '5_20', '6_15']),
  new Note('Ab5', 830.61, 80, ['5_21', '6_16']),
  new Note('A5', 880.0, 81, ['5_22', '6_17']),
  new Note('Bb5', 932.33, 82, ['5_23', '6_18']),
  new Note('B5', 987.77, 83, ['5_24', '6_19']),
  // index 72
  new Note('C6', 1046.5, 84, ['6_20']),
  new Note('Db6', 1108.73, 85, ['6_21']),
  new Note('D6', 1174.66, 86, ['6_22']),
  new Note('Eb6', 1244.51, 87, ['6_23']),
  new Note('E6', 1318.51, 88, ['6_24']),
  new Note('F6', 1396.91, 89),
  new Note('Gb6', 1479.98, 90),
  new Note('G6', 1567.98, 91),
  new Note('Ab6', 1661.22, 92),
  new Note('A6', 1760.0, 93),
  new Note('Bb6', 1864.66, 94),
  new Note('B6', 1975.53, 95),
  // index 84
  new Note('C7', 2093.0, 96),
  new Note('Db7', 2217.46, 97),
  new Note('D7', 2349.32, 98),
  new Note('Eb7', 2489.02, 99),
  new Note('E7', 2637.02, 100),
  new Note('F7', 2793.83, 101),
  new Note('Gb7', 2959.96, 102),
  new Note('G7', 3135.96, 103),
  new Note('Ab7', 3322.44, 104),
  new Note('A7', 3520.0, 105),
  new Note('Bb7', 3729.31, 106),
  new Note('B7', 3951.07, 107),
  // index 96
  new Note('C8', 4186.01, 108),
  new Note('Db8', 4434.92, 109),
  new Note('D8', 4698.63, 110),
  new Note('Eb8', 4978.03, 111),
  new Note('E8', 5274.04, 112),
  new Note('F8', 5587.65, 113),
  new Note('Gb8', 5919.91, 114),
  new Note('G8', 6271.93, 115),
  new Note('Ab8', 6644.88, 116),
  new Note('A8', 7040.0, 117),
  new Note('Bb8', 7458.62, 118),
  new Note('B8', 7902.13, 119),
]
const INTERVALS = {
  5: [7, 5],
  '3add9': [2, 2],
  '4add9': [2, 2, 3],
  major: [4, 3],
  aug: [4, 4],
  minor: [3, 4],
  dim: [3, 3],
  sus2: [2, 5],
  sus4: [5, 2],
  6: [4, 3, 2],
  '6sus2': [2, 5, 2],
  dom7: [4, 3, 3],
  min7: [3, 4, 3],
  maj7: [4, 3, 4],
  maj9: [4, 7, 3],
  'maj7(b9)': [4, 3, 4, 2],
  'maj7(9)': [4, 3, 4, 3],
  'maj7(s9)': [4, 3, 4, 4],
  '7sus4': [5, 2, 3],
  '9sus4': [2, 3, 5],
}

const _arraysAreEqual = (arr1: number[], arr2: number[]): boolean => {
  return arr1.join() == arr2.join()
}
const _midi2Name = (midiNumber: number): string => {
  const note = MUSICAL_NOTES.filter((mNote) => mNote.midi == midiNumber)

  if (note.length) {
    if (note[0]) {
      const name = note[0].name
      return name[1] == 'b' ? `${name[0]}${name[1]}` : `${name[0]}`
    } else {
      return ''
    }
  } else {
    return ''
  }
}

// fret is being pressed or unpressed
// update frets, midis, notes
// try to decipher chord(s)
function toggleFret(event: PointerEvent): void {
  if (event.target instanceof HTMLElement) {
    let elem

    if (event.target.tagName == 'HR') {
      elem = event.target.parentElement
    } else {
      elem = event.target
    }

    const stringId = elem?.parentElement?.dataset.stringId
    const fretId = elem?.dataset.fretId
    const classes = elem?.classList
    const dataset = elem?.dataset

    if (dataset?.pressed == 'false') {
      const stringFretsPressed: NodeList = document.querySelectorAll(
        `.string[data-string-id="${stringId}"] .fret[data-pressed="true"]`,
      )

      if (stringFretsPressed && stringFretsPressed.length) {
        stringFretsPressed.forEach((fret: Node) => {
          if (fret instanceof HTMLElement) {
            fret.dataset.pressed = 'false'
            fret.classList.remove('pressed')
            fretsPressed.value = fretsPressed.value.filter(
              (fretPressed) => fretPressed != fret.dataset.fretId,
            )
          }
        })
      }
      dataset.pressed = 'true'
      classes?.add('pressed')
      fretsPressed.value = [...fretsPressed.value, fretId ?? '']
    } else {
      if (dataset !== undefined) {
        dataset.pressed = 'false'
      }
      classes?.remove('pressed')
      fretsPressed.value = fretsPressed.value.filter((fret) => fret != fretId)
    }

    const sortedFrets: FretArray = fretsPressed.value ? [...fretsPressed.value].sort() : []
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
}

const CHORD_PATTERNS: Record<string, string> = {
  // Triads
  '0,7': '5',
  '0,4,7': 'maj',
  '0,3,7': 'min',
  '0,3,6': 'dim',
  '0,4,8': 'aug',

  // Seventh chords
  '0,4,7,11': 'maj7',
  '0,4,7,10': '7', // dominant‑7th
  '0,3,7,10': 'min7',
  '0,3,6,9': 'hdim7', // half‑diminished

  // Suspensions & added tones
  '0,2,7': 'sus2',
  '0,5,7': 'sus4',
  '0,4,7,14': 'add9',
  '0,3,7,14': 'minadd9',

  // Extensions (optional)
  '0,4,7,11,14': 'maj9',
  '0,3,7,10,14': 'dom9',
  '0,3,7,10,14,21': 'dom13',
}

const NOTE_NAMES_SHARP: string[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
const NOTE_NAMES_FLAT: string[] = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B']

function _midiToPitchClass(n: MidiNote): PitchClass {
  return ((n % 12) + 12) % 12
}
function _pitchClassName(pc: PitchClass, useFlat = false): string {
  if (!NOTE_NAMES_FLAT[pc] || !NOTE_NAMES_SHARP[pc]) return ''

  return useFlat ? NOTE_NAMES_FLAT[pc] : NOTE_NAMES_SHARP[pc]
}

function getChord(midiNums: MidiArray, useFlatNotation = true): ChordName[] {
  if (!midiNums || !midiNums.length) return ['']

  if (midiNums.length > 2) {
    const pitchClasses: Set<PitchClass> = new Set(midiNums.map(_midiToPitchClass))
    const possibleChords: ChordName[] = []

    for (const root of Array.from(pitchClasses)) {
      const intervals = Array.from(pitchClasses)
        .map((pc) => (pc - root + 12) % 12)
        .sort((a, b) => a - b)

      emit('currentInvls', intervals)

      const key = intervals.join(',')
      const type = CHORD_PATTERNS[key]

      if (type) {
        const name = _pitchClassName(root, useFlatNotation)
        possibleChords.push(`${name}${type}`)
      }
    }

    return possibleChords
  } else {
    return ['(Need at least 3 notes)']
  }
}

// old getChord
// function getChord(midiNums: MidiArray = []): ChordName {
//   if (!midiNums || !midiNums.length) return ''

//   if (midiNums.length > 2) {
//     let chordName: ChordName = ''
//     let intval1, intval2, intval3, intval4

//     switch (midiNums.length) {
//       case 3: {
//         // triad
//         if (midiNums[0] && midiNums[1] && midiNums[2]) {
//           intval1 = midiNums[1] - midiNums[0]
//           intval2 = midiNums[2] - midiNums[1]

//           console.log('2 intvals', intval1, intval2)

//           if (_arraysAreEqual([intval1, intval2], INTERVALS['5'])) {
//             chordName = `${_midi2Name(midiNums[0])}5`
//           } else if (_arraysAreEqual([intval1, intval2], INTERVALS['3add9'])) {
//             chordName = `${_midi2Name(midiNums[0])}add9`
//           } else if (_arraysAreEqual([intval1, intval2], INTERVALS['major'])) {
//             chordName = `${_midi2Name(midiNums[0])}maj`
//           } else if (_arraysAreEqual([intval1, intval2], INTERVALS['aug'])) {
//             chordName = `${_midi2Name(midiNums[0])}aug`
//           } else if (_arraysAreEqual([intval1, intval2], INTERVALS['minor'])) {
//             chordName = `${_midi2Name(midiNums[0])}min`
//           } else if (_arraysAreEqual([intval1, intval2], INTERVALS['dim'])) {
//             chordName = `${_midi2Name(midiNums[0])}dim`
//           } else if (_arraysAreEqual([intval1, intval2], INTERVALS['sus2'])) {
//             chordName = `${_midi2Name(midiNums[0])}sus2`
//           } else if (_arraysAreEqual([intval1, intval2], INTERVALS['sus4'])) {
//             chordName = `${_midi2Name(midiNums[0])}sus4`
//           } else {
//             chordName = `${_midi2Name(midiNums[0])}(unidentified)`
//           }
//         }

//         break
//       }
//       case 4: {
//         if (midiNums[0] && midiNums[1] && midiNums[2] && midiNums[3]) {
//           intval1 = midiNums[1] - midiNums[0]
//           intval2 = midiNums[2] - midiNums[1]
//           intval3 = midiNums[3] - midiNums[2]

//           console.log('3 intvals', intval1, intval2, intval3)

//           if (midiNums[3] - midiNums[0] == 12) {
//             // we have an octave, so return triad instead
//             return getChord(midiNums.slice(0, midiNums.length - 1))
//           }

//           if (_arraysAreEqual([intval1, intval2, intval3], INTERVALS['4add9'])) {
//             chordName = `${_midi2Name(midiNums[0])}add9`
//           } else if (_arraysAreEqual([intval1, intval2, intval3], INTERVALS['6'])) {
//             chordName = `${_midi2Name(midiNums[0])}6`
//           } else if (_arraysAreEqual([intval1, intval2, intval3], INTERVALS['6sus2'])) {
//             chordName = `${_midi2Name(midiNums[0])}6sus2`
//           } else if (_arraysAreEqual([intval1, intval2, intval3], INTERVALS['dom7'])) {
//             chordName = `${_midi2Name(midiNums[0])}7`
//           } else if (_arraysAreEqual([intval1, intval2, intval3], INTERVALS['min7'])) {
//             chordName = `${_midi2Name(midiNums[0])}min7`
//           } else if (_arraysAreEqual([intval1, intval2, intval3], INTERVALS['maj7'])) {
//             chordName = `${_midi2Name(midiNums[0])}maj7`
//           } else if (_arraysAreEqual([intval1, intval2, intval3], INTERVALS['maj9'])) {
//             chordName = `${_midi2Name(midiNums[0])}maj9`
//           } else if (_arraysAreEqual([intval1, intval2, intval3], INTERVALS['7sus4'])) {
//             chordName = `${_midi2Name(midiNums[0])}7sus4`
//           } else if (_arraysAreEqual([intval1, intval2, intval3], INTERVALS['9sus4'])) {
//             chordName = `${_midi2Name(midiNums[0])}9sus4`
//           } else {
//             chordName = `${_midi2Name(midiNums[0])}(unidentified)`
//           }
//         }

//         break
//       }
//       case 5: {
//         if (midiNums[0] && midiNums[1] && midiNums[2] && midiNums[3] && midiNums[4]) {
//           intval1 = midiNums[1] - midiNums[0]
//           intval2 = midiNums[2] - midiNums[1]
//           intval3 = midiNums[3] - midiNums[2]
//           intval4 = midiNums[4] - midiNums[3]

//           console.log('4 intvals', intval1, intval2, intval3, intval4)

//           if (_arraysAreEqual([intval1, intval2, intval3, intval4], INTERVALS['maj7(b9)'])) {
//             chordName = `${_midi2Name(midiNums[0])}maj7(b9)`
//           } else if (_arraysAreEqual([intval1, intval2, intval3, intval4], INTERVALS['maj7(9)'])) {
//             chordName = `${_midi2Name(midiNums[0])}maj7(9)`
//           } else if (_arraysAreEqual([intval1, intval2, intval3, intval4], INTERVALS['maj7(s9)'])) {
//             chordName = `${_midi2Name(midiNums[0])}maj7(#9)`
//           } else {
//             chordName = `${_midi2Name(midiNums[0])}(unidentified)`
//           }
//         }

//         break
//       }
//       // case 6: {
//       //   if (midiNums[0] && midiNums[1] && midiNums[2] && midiNums[3] && midiNums[4] && midiNums[5]) {
//       //     intval1 = midiNums[1] - midiNums[0]
//       //     intval2 = midiNums[2] - midiNums[1]
//       //     intval3 = midiNums[3] - midiNums[2]
//       //     intval4 = midiNums[4] - midiNums[3]
//       //     intval5 = midiNums[5] - midiNums[4]

//       //     if (_arraysAreEqual([intval1, intval2, intval3, intval4], INTERVALS['maj7(b9)'])) {
//       //       chordName = `${_midi2Name(midiNums[0])}maj7(b9)`
//       //     } else if (_arraysAreEqual([intval1, intval2, intval3, intval4], INTERVALS['maj7(9)'])) {
//       //       chordName = `${_midi2Name(midiNums[0])}maj7(9)`
//       //     } else if (_arraysAreEqual([intval1, intval2, intval3, intval4], INTERVALS['maj7(s9)'])) {
//       //       chordName = `${_midi2Name(midiNums[0])}maj7(#9)`
//       //     } else {
//       //       chordName = `${_midi2Name(midiNums[0])}(unidentified)`
//       //     }
//       //   }

//       //   break
//       // }
//       default: {
//         if (midiNums[0]) {
//           chordName = `${_midi2Name(midiNums[0])}(unidentified)`
//         }

//         break
//       }
//     }

//     return chordName
//   } else {
//     const letters: string[] = []

//     midiNums.forEach((midi: number) => {
//       letters.push(_midi2Name(midi))
//     })

//     return letters.join(',')
//   }
// }

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
</script>

<template>
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
      <div class="string" data-string-id="6">
        <div class="fret open" @click="toggleFret" data-pressed="false" data-fret-id="6_0"></div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="6_1"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="6_2"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="6_3"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="6_4"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="6_5"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="6_6"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="6_7"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="6_8"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="6_9"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="6_10"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="6_11"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="6_12"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="6_13"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="6_14"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="6_15"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="6_16"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="6_17"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="6_18"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="6_19"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="6_20"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="6_21"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="6_22"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="6_23"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="6_24"
        >
          <hr />
        </div>
      </div>
      <div class="string" data-string-id="5">
        <div class="fret open" @click="toggleFret" data-pressed="false" data-fret-id="5_0"></div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="5_1"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="5_2"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="5_3"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="5_4"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="5_5"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="5_6"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="5_7"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="5_8"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="5_9"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="5_10"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="5_11"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="5_12"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="5_13"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="5_14"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="5_15"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="5_16"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="5_17"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="5_18"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="5_19"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="5_20"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="5_21"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="5_22"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="5_23"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="5_24"
        >
          <hr />
        </div>
      </div>
      <div class="string" data-string-id="4">
        <div class="fret open" @click="toggleFret" data-pressed="false" data-fret-id="4_0"></div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="4_1"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="4_2"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="4_3"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="4_4"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="4_5"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="4_6"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="4_7"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="4_8"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="4_9"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="4_10"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="4_11"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="4_12"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="4_13"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="4_14"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="4_15"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="4_16"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="4_17"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="4_18"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="4_19"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="4_20"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="4_21"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="4_22"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="4_23"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="4_24"
        >
          <hr />
        </div>
      </div>
      <div class="string" data-string-id="3">
        <div class="fret open" @click="toggleFret" data-pressed="false" data-fret-id="3_0"></div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="3_1"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="3_2"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="3_3"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="3_4"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="3_5"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="3_6"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="3_7"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="3_8"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="3_9"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="3_10"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="3_11"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="3_12"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="3_13"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="3_14"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="3_15"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="3_16"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="3_17"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="3_18"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="3_19"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="3_20"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="3_21"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="3_22"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="3_23"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="3_24"
        >
          <hr />
        </div>
      </div>
      <div class="string" data-string-id="2">
        <div class="fret open" @click="toggleFret" data-pressed="false" data-fret-id="2_0"></div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="2_1"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="2_2"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="2_3"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="2_4"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="2_5"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="2_6"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="2_7"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="2_8"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="2_9"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="2_10"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="2_11"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="2_12"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="2_13"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="2_14"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="2_15"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="2_16"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="2_17"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="2_18"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="2_19"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="2_20"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="2_21"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="2_22"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="2_23"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="2_24"
        >
          <hr />
        </div>
      </div>
      <div class="string" data-string-id="1">
        <div class="fret open" @click="toggleFret" data-pressed="false" data-fret-id="1_0"></div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="1_1"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="1_2"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="1_3"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="1_4"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="1_5"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="1_6"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="1_7"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="1_8"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="1_9"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="1_10"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="1_11"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="1_12"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="1_13"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="1_14"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="1_15"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="1_16"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="1_17"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="1_18"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="1_19"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="1_20"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="1_21"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="1_22"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="1_23"
        >
          <hr />
        </div>
        <div
          class="fret"
          @click="toggleFret"
          data-pressed="false"
          data-note-id=""
          data-fret-id="1_24"
        >
          <hr />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
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
}

#fretboard {
  display: flex;
  flex-direction: row;

  #string-notes {
    align-items: center;
    border: 2px solid #000;
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
    border-bottom: 2px solid #000;
    border-top: 2px solid #000;
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

      border-right: 2px solid #000;
      display: flex;
      justify-content: center;
      padding: 0;
      height: 1.75rem;
      width: 1.75rem;

      &:hover {
        background: #fff3a5;
        border-right: 2px solid #ffa500;
        cursor: pointer;
      }

      &.pressed,
      &.pressed:hover {
        background: #8edf82;
        border-right: 2px solid #299519;
        border: none;

        hr {
          border-top-color: #51bb41;
        }
      }

      &:first-of-type {
        border-left: 1px solid #ccc;
        border-right: none;
        border-top: none;
      }
      &:nth-of-type(1) {
        border-left: none;
      }
      &:nth-of-type(2) {
        border-left: 2px solid #000;
      }

      hr {
        border: none;
        border-top: 2px solid #adadad;
        width: 100%;
      }
    }
  }
}
</style>
