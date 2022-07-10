import type { Ref } from 'vue-demi'
import { computed, ref } from 'vue-demi'
import type { MaybeRef } from '@vueuse/shared'
import { resolveUnref } from '@vueuse/shared'
/**
 * Reactively Math.round(value).
 *
 * @see https://vueuse.org/useRound
 * @param base
 * @param exponent
 */
export function useRound(value: MaybeRef<number>): Ref<number> {
  const _value = ref(value)
  return computed<number>(() => Math.round(resolveUnref(_value)))
}
