<script setup lang="ts">
import { interval } from 'rxjs'
import {
  map,
  mapTo,
  takeUntil,
  withLatestFrom,
} from 'rxjs/operators'
import { ref as deepRef, shallowRef } from 'vue'
import { toObserver } from '../toObserver'
import { useSubscription } from '../useSubscription'
import { from, fromEvent } from './index'

const count = shallowRef(0)
const button = deepRef<HTMLButtonElement | null>(null)

useSubscription(
  interval(1000)
    .pipe(
      mapTo(1),
      takeUntil(fromEvent(button, 'click')),
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
