import type { MaybeComputedRef } from '@vueuse/shared'
import type { ComputedRef } from 'vue-demi'
import { resolveUnref } from '@vueuse/shared'
import { computed } from 'vue-demi'

/**
 * Reactive `Array.find`
 *
 * @see https://vueuse.org/useArrayFind
 * @param {Array} list - the array was called upon.
 * @param fn - a function to test each element.
 *
 * @returns the first element in the array that satisfies the provided testing function. Otherwise, undefined is returned.
 */
export function useArrayFind<T>(
  list: MaybeComputedRef<MaybeComputedRef<T>[]>,
  fn: (element: T, index: number, array: MaybeComputedRef<T>[]) => boolean,
): ComputedRef<T | undefined> {
  return computed(() =>
    resolveUnref<T | undefined>(
      resolveUnref(list)
        .find((element, index, array) => fn(resolveUnref(element), index, array)),
    ),
  )
}
