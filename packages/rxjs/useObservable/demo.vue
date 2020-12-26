<script setup lang="ts">
import { useObservable } from '.'
import { interval } from 'rxjs'
import { mapTo, startWith, scan } from 'rxjs/operators'

const count = useObservable(
  interval(1000).pipe(
    mapTo(1),
    startWith(0),
    scan((total, next) => next + total),
  ),
)
</script>

<template>
  <note>Update every 1s</note>
  <p>Counter: {{ count }}</p>
</template>
