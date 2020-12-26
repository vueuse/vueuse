<script setup lang="ts">
import { defineComponent, onMounted, Ref, ref } from 'vue-demi'
import { useSubscription } from '../useSubscription'
import { toObserver } from '../toObserver'
import { from, fromEvent } from '.'
import { interval } from 'rxjs'
import {
  mapTo,
  takeUntil,
  withLatestFrom,
  startWith,
  map,
} from 'rxjs/operators'

const count = ref(0)
const button = ref<HTMLButtonElement | null>(null)

onMounted(() => {
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
