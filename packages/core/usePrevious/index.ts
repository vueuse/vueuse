/* This implementation is original ported from https://github.com/shorwood/pompaute by Stanley Horwood */

import type { Ref } from 'vue-demi'
import { readonly, shallowRef, watch } from 'vue-demi'
import type { MaybeComputedRef } from '@vueuse/shared'
import { resolveRef } from '@vueuse/shared'

/**
 * Holds the previous value of a ref.
 *
 * @see   {@link https://vueuse.org/usePrevious}
 */
export function usePrevious<T>(value: MaybeComputedRef<T>): Readonly<Ref<T | undefined>>
export function usePrevious<T>(value: MaybeComputedRef<T>, initialValue: T): Readonly<Ref<T>>
export function usePrevious<T>(value: MaybeComputedRef<T>, initialValue?: T) {
  const previous = shallowRef<T | undefined>(initialValue)

  watch(
    resolveRef(value),
    (_, oldValue) => {
      previous.value = oldValue
    },
    { flush: 'sync' },
  )

  return readonly(previous)
}
