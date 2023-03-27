import type { ComputedRef } from 'vue-demi'
import { computed } from 'vue-demi'
import { isString } from '../utils'
import type { MaybeComputedRef } from '../utils'
import { resolveUnref } from '../resolveUnref'

const defaultComparator = <T>(value: T, othVal: T) =>
  value === othVal

export function useArrayDifference<T>(list: MaybeComputedRef<T[]>, values: MaybeComputedRef<T[]>, key?: keyof T): ComputedRef<T[]>
export function useArrayDifference<T>(list: MaybeComputedRef<T[]>, values: MaybeComputedRef<T[]>, compareFn?: (value: T, othVal: T) => boolean): ComputedRef<T[]>

/**
 * Reactive get array difference of two array
 * @see https://vueuse.org/useArrayDifference
 * @returns {Array} - the difference of two array
 * @param args
 */
export function useArrayDifference<T>(...args: any[]): ComputedRef<T[]> {
  const list: MaybeComputedRef<T[]> = args[0]
  const values: MaybeComputedRef<T[]> = args[1]
  let compareFn = args[2] ?? defaultComparator

  if (isString(compareFn)) {
    const key = compareFn as keyof T
    compareFn = (value: T, othVal: T) => value[key] === othVal[key]
  }
  return computed(() => resolveUnref(list).filter(x => resolveUnref(values).findIndex(y => compareFn(x, y)) === -1))
}
