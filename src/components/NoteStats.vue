<script setup lang="ts">
const props = defineProps({
  chord: { type: String, default: '' },
  frets: { type: Array, default: () => [] },
  midis: { type: Array, default: () => [] },
  notes: { type: Array, default: () => [] },
  invls: { type: Array, default: () => [] },
  appKey: { type: [String, Number], default: null },
})
</script>

<template>
  <div id="note-stats" :key="appKey">
    <div id="current-chord" :class="{ empty: !chord.length }">
      <strong>Chord</strong>: {{ chord || '' }}
    </div>

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
  </div>
</template>

<style scoped>
#note-stats {
  font-size: 0.9rem;
  line-height: 1.2;
  padding-top: 5px;

  @media (min-width: 1200px) {
    font-size: 1rem;
  }

  #current-chord {
    font-size: 1rem;

    @media (min-width: 1200px) {
      font-size: 1.2rem;
    }
  }
}
</style>
