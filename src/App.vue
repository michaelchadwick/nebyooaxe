<script setup lang="ts">
import Fretboard from './components/Fretboard.vue'
import { ref } from 'vue'

type NoteArray = string[]

const notes = ref<NoteArray>([])

function currentNotes(newNotes: NoteArray): void {
  notes.value = newNotes
}
</script>

<template>
  <header>
    <h1>NebyooAxe</h1>
  </header>

  <main>
    <Fretboard @current-notes="currentNotes" />
    <span id="current-notes" :class="{ empty: !notes.length }">
      Current Notes: {{ notes.length ? notes : '' }}
    </span>
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
