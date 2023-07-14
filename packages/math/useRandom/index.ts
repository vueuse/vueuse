import type { ComputedRef } from 'vue-demi'
import { computed } from 'vue-demi'
import type { MaybeRefOrGetter } from '@vueuse/shared'
import { toValue } from '@vueuse/shared'

function useRandom(min: MaybeRefOrGetter<number>, max: MaybeRefOrGetter<number>): ComputedRef<number> {
  return computed<number>(() => Math.random() * (toValue(max) - toValue(min)) + toValue(min))
}

export { useRandom }
