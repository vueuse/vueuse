import { computed } from '@vue/reactivity'
import type { MaybeRef } from '@vueuse/shared'
import { isRef, unref, watchEffect } from 'vue-demi'

export type UseSortCompareFn<T> = (a: T, b: T) => number

export type UseSortFn<T> = (arr: T[], compareFn: UseSortCompareFn<T>) => T[]

export interface UseSortOptions<T> {
  /**
   * compare function
   */
  compareFn?: UseSortCompareFn<T>
  /**
   * change the value of the source array
   * @default false
   */
  dirty?: boolean
}

const defaultCompare: UseSortCompareFn<number> = (a, b) => a - b

/**
 * reactive sort array
 *
 * @see https://vueuse.org/useSort
 * @param source source array
 * @param sortFn sort function
 * @param options
 */
export function useSort<T>(source: MaybeRef<T[]>, sortFn: UseSortFn<T>, options: UseSortOptions<T> = {}) {
  const { compareFn = defaultCompare, dirty = false } = options

  if (!dirty) return computed(() => sortFn(unref(source), compareFn as UseSortCompareFn<T>))

  // dirty
  watchEffect(() => {
    const result = sortFn(unref(source), compareFn as UseSortCompareFn<T>)
    if (isRef(source)) { source.value = result }
    else {
      source.length = 0
      source.push(...result)
    }
  })

  return source
}

/**
 * wrap useSort
 *
 * @see https://vueuse.org/useSort/#usesortwrapfn
 * @param sortFn sort function
 * @param options
 */
export function useSortWrapFn<T>(sortFn: UseSortFn<T>, options: UseSortOptions<T> = {}) {
  return (arr: MaybeRef<T[]>, _options: UseSortOptions<T> = {}) => {
    return useSort<T>(arr, sortFn, {
      ...options,
      ..._options,
    })
  }
}
