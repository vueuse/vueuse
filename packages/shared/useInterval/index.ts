import { ref } from 'vue-demi'
import { useIntervalFn } from '../useIntervalFn'

export function useInterval(interval = 1000, immediate = true) {
  const counter = ref(0)

  return {
    counter,
    ...useIntervalFn(() => counter.value += 1, interval, immediate),
  }
}
