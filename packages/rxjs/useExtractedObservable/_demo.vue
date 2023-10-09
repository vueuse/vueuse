<script setup lang="ts">
import { ref } from 'vue-demi'
import { interval } from 'rxjs'
import { mapTo, scan, startWith } from 'rxjs/operators'
import { useExtractedObservable } from '.'

const start = ref(0)

const count = useExtractedObservable(
  start,
  (start) => {
    return interval(1000).pipe(
      mapTo(1),
      startWith(start),
      scan((total, next) => next + total),
    )
  },
)
</script>

<template>
  <note>Update every 1s</note>
  <label>
    Start: <input v-model="start" type="number">
  </label>
  <p>Counter: {{ count }}</p>
</template>
