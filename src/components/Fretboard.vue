<script setup lang="ts">
type NoteArray = string[]

const FRET2NOTE = [
  // index 0
  { name: 'C0', frequency: 16.35, midi: 12 },
  { name: 'Db0', frequency: 17.32, midi: 13 },
  { name: 'D0', frequency: 18.35, midi: 14 },
  { name: 'Eb0', frequency: 19.45, midi: 15 },
  { name: 'E0', frequency: 20.6, midi: 16 },
  { name: 'F0', frequency: 21.83, midi: 17 },
  { name: 'Gb0', frequency: 23.12, midi: 18 },
  { name: 'G0', frequency: 24.5, midi: 19 },
  { name: 'Ab0', frequency: 25.96, midi: 20 },
  { name: 'A0', frequency: 27.5, midi: 21 },
  { name: 'Bb0', frequency: 29.14, midi: 22 },
  { name: 'B0', frequency: 30.87, midi: 23 },
  // index 12
  { name: 'C1', frequency: 32.7, midi: 24 },
  { name: 'Db1', frequency: 34.65, midi: 25 },
  { name: 'D1', frequency: 36.71, midi: 26 },
  { name: 'Eb1', frequency: 38.89, midi: 27 },
  { name: 'E1', frequency: 41.2, midi: 28 },
  { name: 'F1', frequency: 43.65, midi: 29 },
  { name: 'Gb1', frequency: 46.25, midi: 30 },
  { name: 'G1', frequency: 49.0, midi: 31 },
  { name: 'Ab1', frequency: 51.91, midi: 32 },
  { name: 'A1', frequency: 55.0, midi: 33 },
  { name: 'Bb1', frequency: 58.27, midi: 34 },
  { name: 'B1', frequency: 61.74, midi: 35 },
  // index 24
  { name: 'C2', frequency: 65.41, midi: 36 },
  { name: 'Db2', frequency: 69.3, midi: 37 },
  { name: 'D2', frequency: 73.42, midi: 38 },
  { name: 'Eb2', frequency: 77.78, midi: 39 },
  { name: 'E2', frequency: 82.41, midi: 40, fretIds: ['1_0'] },
  { name: 'F2', frequency: 87.31, midi: 41, fretIds: ['1_1'] },
  { name: 'Gb2', frequency: 92.5, midi: 42, fretIds: ['1_2'] },
  { name: 'G2', frequency: 98.0, midi: 43, fretIds: ['1_3'] },
  { name: 'Ab2', frequency: 103.83, midi: 44, fretIds: ['1_4'] },
  { name: 'A2', frequency: 110.0, midi: 45, fretIds: ['1_5', '2_0'] },
  { name: 'Bb2', frequency: 116.54, midi: 46, fretIds: ['1_6'] },
  { name: 'B2', frequency: 123.47, midi: 47, fretIds: ['1_7'] },
  // index 36
  { name: 'C3', frequency: 130.81, midi: 48, fretIds: ['1_8'] },
  { name: 'Db3', frequency: 138.59, midi: 49, fretIds: ['1_9'] },
  { name: 'D3', frequency: 146.83, midi: 50, fretIds: ['1_10', '3_0'] },
  { name: 'Eb3', frequency: 155.56, midi: 51, fretIds: ['1_11'] },
  { name: 'E3', frequency: 164.81, midi: 52, fretIds: ['1_12'] },
  { name: 'F3', frequency: 174.61, midi: 53, fretIds: ['1_13'] },
  { name: 'Gb3', frequency: 185.0, midi: 54, fretIds: ['1_14'] },
  { name: 'G3', frequency: 196.0, midi: 55, fretIds: ['1_15', '4_0'] },
  { name: 'Ab3', frequency: 207.65, midi: 56, fretIds: ['1_16'] },
  { name: 'A3', frequency: 220.0, midi: 57, fretIds: ['1_17'] },
  { name: 'Bb3', frequency: 233.08, midi: 58, fretIds: ['1_18'] },
  { name: 'B3', frequency: 246.94, midi: 59, fretIds: ['1_19', '5_0'] },
  // index 48
  { name: 'C4', frequency: 261.63, midi: 60, fretIds: ['1_20'] },
  { name: 'Db4', frequency: 277.18, midi: 61, fretIds: ['1_21'] },
  { name: 'D4', frequency: 293.66, midi: 62, fretIds: ['1_22'] },
  { name: 'Eb4', frequency: 311.13, midi: 63, fretIds: ['1_23'] },
  { name: 'E4', frequency: 329.63, midi: 64, fretIds: ['1_24', '6_0'] },
  { name: 'F4', frequency: 349.23, midi: 65, fretIds: ['6_1'] },
  { name: 'Gb4', frequency: 369.99, midi: 66, fretIds: ['6_2'] },
  { name: 'G4', frequency: 392.0, midi: 67, fretIds: ['6_3'] },
  { name: 'Ab4', frequency: 415.3, midi: 68, fretIds: ['6_4'] },
  { name: 'A4', frequency: 440.0, midi: 69, fretIds: ['6_5'] },
  { name: 'Bb4', frequency: 466.16, midi: 70, fretIds: ['6_6'] },
  { name: 'B4', frequency: 493.88, midi: 71, fretIds: ['6_7'] },
  // index 60
  { name: 'C5', frequency: 523.25, midi: 72, fretIds: ['6_8'] },
  { name: 'Db5', frequency: 554.37, midi: 73, fretIds: ['6_9'] },
  { name: 'D5', frequency: 587.33, midi: 74, fretIds: ['6_10'] },
  { name: 'Eb5', frequency: 622.25, midi: 75, fretIds: ['6_11'] },
  { name: 'E5', frequency: 659.25, midi: 76, fretIds: ['6_12'] },
  { name: 'F5', frequency: 698.46, midi: 77, fretIds: ['6_13'] },
  { name: 'Gb5', frequency: 739.99, midi: 78, fretIds: ['6_14'] },
  { name: 'G5', frequency: 783.99, midi: 79, fretIds: ['6_15'] },
  { name: 'Ab5', frequency: 830.61, midi: 80, fretIds: ['6_16'] },
  { name: 'A5', frequency: 880.0, midi: 81, fretIds: ['6_17'] },
  { name: 'Bb5', frequency: 932.33, midi: 82, fretIds: ['6_18'] },
  { name: 'B5', frequency: 987.77, midi: 83, fretIds: ['6_19'] },
  // index 72
  { name: 'C6', frequency: 1046.5, midi: 84, fretIds: ['6_20'] },
  { name: 'Db6', frequency: 1108.73, midi: 85, fretIds: ['6_21'] },
  { name: 'D6', frequency: 1174.66, midi: 86, fretIds: ['6_22'] },
  { name: 'Eb6', frequency: 1244.51, midi: 87, fretIds: ['6_23'] },
  { name: 'E6', frequency: 1318.51, midi: 88, fretIds: ['6_24'] },
  { name: 'F6', frequency: 1396.91, midi: 89 },
  { name: 'Gb6', frequency: 1479.98, midi: 90 },
  { name: 'G6', frequency: 1567.98, midi: 91 },
  { name: 'Ab6', frequency: 1661.22, midi: 92 },
  { name: 'A6', frequency: 1760.0, midi: 93 },
  { name: 'Bb6', frequency: 1864.66, midi: 94 },
  { name: 'B6', frequency: 1975.53, midi: 95 },
  // index 84
  { name: 'C7', frequency: 2093.0, midi: 96 },
  { name: 'Db7', frequency: 2217.46, midi: 97 },
  { name: 'D7', frequency: 2349.32, midi: 98 },
  { name: 'Eb7', frequency: 2489.02, midi: 99 },
  { name: 'E7', frequency: 2637.02, midi: 100 },
  { name: 'F7', frequency: 2793.83, midi: 101 },
  { name: 'Gb7', frequency: 2959.96, midi: 102 },
  { name: 'G7', frequency: 3135.96, midi: 103 },
  { name: 'Ab7', frequency: 3322.44, midi: 104 },
  { name: 'A7', frequency: 3520.0, midi: 105 },
  { name: 'Bb7', frequency: 3729.31, midi: 106 },
  { name: 'B7', frequency: 3951.07, midi: 107 },
  // index 96
  { name: 'C8', frequency: 4186.01, midi: 108 },
  { name: 'Db8', frequency: 4434.92, midi: 109 },
  { name: 'D8', frequency: 4698.63, midi: 110 },
  { name: 'Eb8', frequency: 4978.03, midi: 111 },
  { name: 'E8', frequency: 5274.04, midi: 112 },
  { name: 'F8', frequency: 5587.65, midi: 113 },
  { name: 'Gb8', frequency: 5919.91, midi: 114 },
  { name: 'G8', frequency: 6271.93, midi: 115 },
  { name: 'Ab8', frequency: 6644.88, midi: 116 },
  { name: 'A8', frequency: 7040.0, midi: 117 },
  { name: 'Bb8', frequency: 7458.62, midi: 118 },
  { name: 'B8', frequency: 7902.13, midi: 119 },
]

const emit = defineEmits<{
  'current-notes': (notes: NoteArray) => void
}>()

function toggleFret(event: PointerEvent): void {
  if (event.target instanceof HTMLElement) {
    let elem

    if (event.target.tagName == 'HR') {
      elem = event.target.parentElement
    } else {
      elem = event.target
    }

    const fretId = elem?.dataset.fretId
    const classes = elem?.classList
    const dataset = elem?.dataset

    if (dataset?.pressed == 'false') {
      dataset.pressed = 'true'
      classes?.add('pressed')
    } else {
      if (dataset !== undefined) {
        dataset.pressed = 'false'
      }
      classes?.remove('pressed')
    }

    console.log('toggleFret', fretId, dataset, classes)

    emit('current-notes', getChord())
  }
}

function getChord(): NoteArray {
  const pressedNotes: HTMLElement[] = Array.from(
    document.querySelectorAll('.fret[data-pressed="true"]'),
  )
  const fretIds: NoteArray = pressedNotes.map((note: HTMLElement) => note.dataset.fretId)

  let noteArray: NoteArray = []

  fretIds.forEach((fretId) => {
    FRET2NOTE.forEach((f2n) => {
      if (f2n.fretIds?.includes(fretId)) {
        noteArray.push(f2n.name)
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

    <div id="string-open-spaces">
      <div class="fret" @click="toggleFret" data-pressed="false" data-fret-id="6_0"></div>
      <div class="fret" @click="toggleFret" data-pressed="false" data-fret-id="5_0"></div>
      <div class="fret" @click="toggleFret" data-pressed="false" data-fret-id="4_0"></div>
      <div class="fret" @click="toggleFret" data-pressed="false" data-fret-id="3_0"></div>
      <div class="fret" @click="toggleFret" data-pressed="false" data-fret-id="2_0"></div>
      <div class="fret" @click="toggleFret" data-pressed="false" data-fret-id="1_0"></div>
    </div>

    <div id="strings">
      <div class="string" data-string-id="6">
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
    border: 1px solid gray;
    font-weight: 700;
    margin: 0;
    padding: 0.2em 0;
    text-align: center;
    width: 1.75rem;
    writing-mode: sideways-lr;
  }
}

#string-notes {
  align-items: center;
  border: 1px solid gray;
  display: flex;
  flex-direction: column;
  font-size: 1rem;
  font-weight: 700;
  margin-top: 2px;
  width: 1.75rem;

  div {
    align-items: center;
    display: flex;
    height: 1.75rem;
  }
}

#string-open-spaces {
  display: flex;
  flex-direction: column;
  margin-top: 2px;
  width: 1.75rem;

  div {
    height: 1.75rem;

    &:hover {
      background: #fff3a5;
      cursor: pointer;
    }
  }
}

#fretboard {
  display: flex;
  flex-direction: row;

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
      border-left: 2px solid #000;
      display: flex;
      justify-content: center;
      padding: 0;
      height: 1.75rem;
      width: 1.75rem;

      &:hover {
        background: #fff3a5;
        border: 1px solid orange;
        cursor: pointer;

        &.pressed {
          background: #8edf82;
        }
      }

      &:first-of-type {
        border-left: 1px solid #ccc;
      }
      &:last-of-type {
        border-right: 2px solid #727272;
      }

      hr {
        border: none;
        border-top: 2px solid rgb(152, 152, 152);
        width: 100%;
      }
    }
  }
}

.pressed {
  background: #8edf82;
}
</style>
