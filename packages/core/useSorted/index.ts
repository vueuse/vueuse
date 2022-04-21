import { computed } from '@vue/reactivity'
import type { MaybeRef } from '@vueuse/shared'
import { isRef, unref, watchEffect } from 'vue-demi'

export type UseSortedCompareFn<T> = (a: T, b: T) => number

export type UseSortedFn<T> = (arr: T[], compareFn: UseSortedCompareFn<T>) => T[]

export interface UseSortedOptions<T> {
  /**
   * sort algorithm
   */
  sortFn?: UseSortedFn<T>
  /**
   * compare function
   */
  compareFn?: UseSortedCompareFn<T>
  /**
   * change the value of the source array
   * @default false
   */
  dirty?: boolean
}

const defaultSortFn = <T>(source: T[], compareFn: UseSortedCompareFn<T>): T[] => source.sort(compareFn)
const defaultCompare: UseSortedCompareFn<number> = (a, b) => a - b

/**
 * reactive sort array
 *
 * @see https://vueuse.org/useSorted
 * @param source source array
 * @param options
 */
export function useSorted<T>(source: MaybeRef<T[]>, options: UseSortedOptions<T> = {}) {
  const { sortFn = defaultSortFn, compareFn = defaultCompare, dirty = false } = options

  if (!dirty) return computed(() => sortFn(unref(source), compareFn as UseSortedCompareFn<T>))

  // dirty
  watchEffect(() => {
    const result = sortFn(unref(source), compareFn as UseSortedCompareFn<T>)
    if (isRef(source)) { source.value = result }
    else {
      source.length = 0
      source.push(...result)
    }
  })

  return source
}

/**
 * wrap useSorted
 *
 * @see https://vueuse.org/useSorted/#usesortedwrapfn
 * @param sortFn sort function
 * @param options
 */
export function useSortedWrapFn<T>(sortFn: UseSortedFn<T>, options: UseSortedOptions<T> = {}) {
  return (source: MaybeRef<T[]>, _options: UseSortedOptions<T> = {}) => {
    return useSorted<T>(source, {
      sortFn,
      ...options,
      ..._options,
    })
  }
}
