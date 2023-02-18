import type { ComputedRef } from 'vue-demi'
import { computed } from 'vue-demi'
import type { MaybeComputedRef } from '../utils'
import { resolveUnref } from '../resolveUnref'

// Polyfill for node version < 18
function findLast<T>(arr: T[], cb: (element: T, index: number, array: T[]) => boolean): T | undefined {
  let index = arr.length
  while (index-- > 0) {
    if (cb(arr[index], index, arr))
      return arr[index]
  }
  return undefined
}

/**
 * Reactive `Array.findLast`
 *
 * @see https://vueuse.org/useArrayFindLast
 * @param {Array} list - the array was called upon.
 * @param fn - a function to test each element.
 *
 * @returns the last element in the array that satisfies the provided testing function. Otherwise, undefined is returned.
 */
export function useArrayFindLast<T>(
  list: MaybeComputedRef<MaybeComputedRef<T>[]>,
  fn: (element: T, index: number, array: MaybeComputedRef<T>[]) => boolean,
): ComputedRef<T | undefined> {
  return computed(() =>
    resolveUnref<T | undefined>(
      // @ts-expect-error - missing in types
      // https://github.com/microsoft/TypeScript/issues/48829
      !Array.prototype.findLast
        ? findLast(resolveUnref(list), (element, index, array) => fn(resolveUnref(element), index, array))
        : resolveUnref(list)
          // @ts-expect-error - missing in types
          .findLast((element, index, array) => fn(resolveUnref(element), index, array)),
    ),
  )
}
