import { computed } from '@vue/reactivity'
import type { MaybeRef } from '@vueuse/shared'
import { isRef, unref, watchEffect } from 'vue-demi'

export type UseSortCompareFn<T> = (a: T, b: T) => number

export type UseSortFn<T> = (arr: T[], compareFn: UseSortCompareFn<T>) => T[]

const defaultCompare: UseSortCompareFn<number> = (a, b) => a - b

export interface UseSortOptions<T> {
  compareFn?: UseSortCompareFn<T>
  dirty?: boolean
}

export function useSort<T>(arr: MaybeRef<T[]>, sortFn: UseSortFn<T>, options: UseSortOptions<T> = {}) {
  const { compareFn = defaultCompare, dirty = false } = options
  if (!dirty) return computed(() => sortFn(unref(arr), compareFn as UseSortCompareFn<T>))

  // dirty
  watchEffect(() => {
    const result = sortFn(unref(arr), compareFn as UseSortCompareFn<T>)
    if (isRef(arr)) { arr.value = result }
    else {
      arr.length = 0
      arr.push(...result)
    }
  })

  return arr
}
