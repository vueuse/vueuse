<script setup lang="ts">
import type { Ref } from 'vue'
import { from, fromEvent, toObserver, useSubscription } from '@vueuse/rxjs'
import { interval } from 'rxjs'
import {
  map,
  mapTo,
  takeUntil,
  withLatestFrom,
} from 'rxjs/operators'
import { ref as deepRef, shallowRef } from 'vue'

const count = shallowRef(0)
const button = deepRef<HTMLButtonElement | null>(null)

useSubscription(
  interval(1000)
    .pipe(
      mapTo(1),
      takeUntil(fromEvent(button as Ref<HTMLButtonElement>, 'click')),
      withLatestFrom(from(count, {
        immediate: true,
        deep: false,
      })),
      map(([curr, total]) => curr + total),
    )
    .subscribe(toObserver(count)),
)
</script>

<template>
  <div>
    <button @click="count++">
      count is: {{ count }}
    </button>
    <button ref="button">
      stop
    </button>
  </div>
</template>
