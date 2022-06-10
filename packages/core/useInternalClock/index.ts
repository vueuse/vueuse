import { ref } from 'vue-demi'

import { useIntervalFn } from '@vueuse/core'

export const useInternalClock = () => {
  const currentTime = ref(new Date())

  useIntervalFn (() => {
    currentTime.value = new Date()
  }, 1000)

  return {
    currentTime,
  }
}
