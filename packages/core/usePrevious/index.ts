/* This implementation is original ported from https://github.com/shorwood/pompaute by Stanley Horwood */

import type { Ref } from 'vue-demi'
import { readonly, shallowRef, watch } from 'vue-demi'
import type { MaybeRefOrGetter } from '@vueuse/shared'
import { toRef } from '@vueuse/shared'

/**
 * Holds the previous value of a ref.
 *
 * @see   {@link https://vueuse.org/usePrevious}
 */
export function usePrevious<T>(value: MaybeRefOrGetter<T>): Readonly<Ref<T | undefined>>
export function usePrevious<T>(value: MaybeRefOrGetter<T>, initialValue: T): Readonly<Ref<T>>
export function usePrevious<T>(value: MaybeRefOrGetter<T>, initialValue?: T) {
  const previous = shallowRef<T | undefined>(initialValue)

  watch(
    toRef(value),
    (_, oldValue) => {
      previous.value = oldValue
    },
    { flush: 'sync' },
  )

  return readonly(previous)
}
