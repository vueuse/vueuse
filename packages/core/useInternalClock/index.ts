import { ref } from 'vue-demi'

import { useIntervalFn } from '@vueuse/core'

export interface UseInternalClockOptions {
  /**
   *
   * The precision with which the clock will update.
   *
   */
  tickRate?: number
}

const defaultOptions = {
  tickRate: 1000,
}

export const useInternalClock = (options?: UseInternalClockOptions) => {
  const {
    tickRate,
  } = options || defaultOptions

  const currentTime = ref(new Date())

  useIntervalFn (() => {
    currentTime.value = new Date()
  }, tickRate)

  return {
    currentTime,
  }
}

export type UseInternalClockReturn = ReturnType<typeof useInternalClock>
