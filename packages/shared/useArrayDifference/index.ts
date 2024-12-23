import type { ComputedRef } from 'vue'
import type { MaybeRefOrGetter } from '../utils'
import { computed } from 'vue'
import { toValue } from '../toValue'

export interface UseArrayDifferenceOptions {
  /**
   * Whether to merge differences
   * @default false
   */
  mergeDiff?: boolean
}

function defaultComparator<T>(value: T, othVal: T) {
  return value === othVal
}

export function useArrayDifference<T>(
  list: MaybeRefOrGetter<T[]>,
  values: MaybeRefOrGetter<T[]>,
  key?: keyof T,
  options?: UseArrayDifferenceOptions
): ComputedRef<T[]>
export function useArrayDifference<T>(
  list: MaybeRefOrGetter<T[]>,
  values: MaybeRefOrGetter<T[]>,
  compareFn?: (value: T, othVal: T) => boolean,
  options?: UseArrayDifferenceOptions
): ComputedRef<T[]>

/**
 * Reactive get array difference of two array
 * @see https://vueuse.org/useArrayDifference
 * @returns - the difference of two array
 * @param args
 */
export function useArrayDifference<T>(...args: any[]): ComputedRef<T[]> {
  const list: MaybeRefOrGetter<T[]> = args[0]
  const values: MaybeRefOrGetter<T[]> = args[1]

  let compareFn = args[2] ?? defaultComparator
  const {
    mergeDiff = false,
  } = args[3] ?? {}

  if (typeof compareFn === 'string') {
    const key = compareFn as keyof T
    compareFn = (value: T, othVal: T) => value[key] === othVal[key]
  }

  const diff1 = computed(() => toValue(list).filter(x => toValue(values).findIndex(y => compareFn(x, y)) === -1))
  const diff2 = computed(() => toValue(values).filter(x => toValue(list).findIndex(y => compareFn(x, y)) === -1))

  const result = computed(() => mergeDiff ? [...toValue(diff1), ...toValue(diff2)] : toValue(diff1))

  return result
}
