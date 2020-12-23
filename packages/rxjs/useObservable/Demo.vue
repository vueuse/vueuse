<script setup lang="ts">
import { defineComponent } from 'vue-demi'
import { useObservable } from './index'
import { interval } from 'rxjs'
import { mapTo, startWith, scan } from 'rxjs/operators'

const count = useObservable(
  interval(1000).pipe(
    mapTo(1),
    startWith(0),
    scan((total, next) => next + total)
  )
)

const count
</script>

<template>
  <div>
    <note>Update every 1s</note>
    <p>Counter: {{ count }}</p>
  </div>
</template>
