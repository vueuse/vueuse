<script setup lang="ts">
import type { Ref } from 'vue'
import { interval } from 'rxjs'
import {
  map,
  mapTo,
  startWith,
  takeUntil,
  withLatestFrom,
} from 'rxjs/operators'
import { ref as deepRef, shallowRef } from 'vue'
import { from, fromEvent } from '../from'
import { useSubscription } from '../useSubscription'
import { toObserver } from './index'

const count = shallowRef(0)
const button = deepRef<HTMLButtonElement | null>(null)

useSubscription(
  interval(1000)
    .pipe(
      mapTo(1),
      takeUntil(fromEvent(button as Ref<HTMLButtonElement>, 'click')),
      withLatestFrom(from(count).pipe(startWith(0))),
      map(([total, curr]) => curr + total),
    )
    .subscribe(toObserver(count)),
)
</script>

<template>
  <button @click="count++">
    count is: {{ count }}
  </button>
  <button ref="button">
    stop
  </button>
</template>
