<script setup lang="ts">
import { interval } from 'rxjs'
import { mapTo, scan, startWith } from 'rxjs/operators'
import { useObservable } from '.'

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
