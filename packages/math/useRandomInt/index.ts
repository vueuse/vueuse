import type { ComputedRef } from 'vue-demi'
import { computed } from 'vue-demi'
import type { MaybeRefOrGetter } from '@vueuse/shared'
import { toValue } from '@vueuse/shared'

function useRandomInt(min: MaybeRefOrGetter<number>, max: MaybeRefOrGetter<number>): ComputedRef<number> {
  min.value = Math.ceil(toValue(min))
  max.value = Math.floor(toValue(max))
  return computed<number>(() => Math.floor(Math.random() * (toValue(max) - toValue(min)) + toValue(min)))
}

export { useRandomInt }
