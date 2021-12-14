<script setup lang="ts">
import type { Ref } from 'vue-demi'
import { onMounted, ref } from 'vue-demi'
import { interval } from 'rxjs'
import {
  mapTo,
  takeUntil,
  withLatestFrom,
  map,
} from 'rxjs/operators'
import { useSubscription } from '../useSubscription'
import { toObserver } from '../toObserver'
import { from, fromEvent } from '.'

const count = ref(0)
const button = ref<HTMLButtonElement | null>(null)

onMounted(() => {
  useSubscription(
    interval(1000)
      .pipe(
        mapTo(1),
        takeUntil(fromEvent(button as Ref<HTMLButtonElement>, 'click')),
        withLatestFrom(from(count, {
          immediate: true,
          deep: false,
        })),
        map(([total, curr]) => curr + total),
      )
      .subscribe(toObserver(count)),
  )
})
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
