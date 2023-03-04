import type { ComputedRef } from 'vue-demi'
import { computed } from 'vue-demi'
import { containsProp, isObject } from '../utils'
import type { MaybeComputedRef } from '../utils'
import { resolveUnref } from '../resolveUnref'

export type UseArrayIncludesComparatorFn<T, V> = ((element: T, value: V, index: number, array: MaybeComputedRef<T>[]) => boolean)

function isArrayIncludesOptions<T, V>(obj: any): obj is UseArrayIncludesOptions<T, V> {
  return isObject(obj) && containsProp(obj, 'formIndex', 'comparator')
}

export interface UseArrayIncludesOptions<T, V> {
  fromIndex?: number
  comparator?: UseArrayIncludesComparatorFn<T, V> | keyof T
}

export function useArrayIncludes<T, V = any>(
  list: MaybeComputedRef<MaybeComputedRef<T>[]>,
  value: MaybeComputedRef<V>,
  comparator?: UseArrayIncludesComparatorFn<T, V>,
): ComputedRef<boolean>
export function useArrayIncludes<T, V = any>(
  list: MaybeComputedRef<MaybeComputedRef<T>[]>,
  value: MaybeComputedRef<V>,
  comparator?: keyof T,
): ComputedRef<boolean>
export function useArrayIncludes<T, V = any>(
  list: MaybeComputedRef<MaybeComputedRef<T>[]>,
  value: MaybeComputedRef<V>,
  options?: UseArrayIncludesOptions<T, V>,
): ComputedRef<boolean>
/**
 * Reactive `Array.includes`
 *
 * @see https://vueuse.org/useArrayIncludes
 *
 * @returns {boolean} true if the `value` is found in the array. Otherwise, false.
 * @param args
 */
export function useArrayIncludes<T, V = any>(
  ...args: any[]
): ComputedRef<boolean> {
  const list: MaybeComputedRef<MaybeComputedRef<T>[]> = args[0]
  const value: MaybeComputedRef<V> = args[1]

  let comparator: UseArrayIncludesComparatorFn<T, V> = args[2]
  let formIndex = 0

  if (isArrayIncludesOptions(comparator)) {
    formIndex = comparator.fromIndex ?? 0
    comparator = comparator.comparator!
  }

  if (typeof comparator === 'string') {
    const key = comparator as keyof T
    comparator = (element: T, value: V) => element[key] === resolveUnref(value)
  }

  comparator = comparator ?? ((element: T, value: T) => element === resolveUnref(value))

  return computed(() =>
    resolveUnref(list)
      .slice(formIndex)
      .some((element, index, array) =>
        comparator(resolveUnref(element), resolveUnref(value), index, resolveUnref(array)),
      ),
  )
}
