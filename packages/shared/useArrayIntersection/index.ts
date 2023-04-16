import type { ComputedRef } from 'vue-demi'
import { computed } from 'vue-demi'
import type { MaybeRefOrGetter } from '../utils'
import { toValue } from '../toValue'

function defaultComparator<T>(value: T, othVal: T) {
  return value === othVal
}

export function useArrayIntersection<T>(list: MaybeRefOrGetter<MaybeRefOrGetter<T>[]>, values: MaybeRefOrGetter<MaybeRefOrGetter<T>[]>, key?: keyof T): ComputedRef<T[]>
export function useArrayIntersection<T>(list: MaybeRefOrGetter<MaybeRefOrGetter<T>[]>, values: MaybeRefOrGetter<MaybeRefOrGetter<T>[]>, compareFn?: (value: T, othVal: T) => boolean): ComputedRef<T[]>

/**
 * Reactive get intersection of two arrays
 * @see https://vueuse.org/useArrayIntersection
 * @returns {Array} - the intersection of two arrays
 * @param args
 */
export function useArrayIntersection<T>(...args: any[]): ComputedRef<T[]> {
  const list: MaybeRefOrGetter<MaybeRefOrGetter<T>[]> = args[0]
  const values: MaybeRefOrGetter<MaybeRefOrGetter<T>[]> = args[1]
  let compareFn = args[2] ?? defaultComparator

  if (typeof compareFn === 'string') {
    const key = compareFn as keyof T
    compareFn = (a: T, b: T) => a[key] === b[key]
  }

  return computed(() => {
    const listValue = toValue(list).map(i => toValue(i))
    const valuesValue = toValue(values).map(i => toValue(i))

    return listValue.filter(item => valuesValue.some(value => compareFn(item, value)))
  })
}
