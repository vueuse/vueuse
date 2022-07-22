import { computed } from 'vue-demi'
import type { ComputedRef } from 'vue-demi'
import type { MaybeComputedRef } from '@vueuse/shared'
import { resolveUnref } from '@vueuse/shared'

export function useRandomInteger(min: MaybeComputedRef<number>, max: MaybeComputedRef<number>): ComputedRef<number> {
  return computed(() => {
    let mixValue = resolveUnref(min)
    let maxValue = resolveUnref(max)
    if (mixValue > maxValue) {
      const swap = mixValue
      mixValue = maxValue
      maxValue = swap
    }
    return Math.floor(Math.random() * (maxValue - mixValue + 1)) + mixValue
  })
}
