import { computed } from '@vue/reactivity'
import type { MaybeRef } from '@vueuse/shared'
import { unref } from 'vue-demi'

export type UseSortCompareFn<T> = (a: T, b: T) => number

export type UseSortFn<T> = (arr: T[], compareFn: UseSortCompareFn<T>) => T[]

const defaultCompare: UseSortCompareFn<number> = (a, b) => a - b

export interface UseSortOptions<T> {
  compareFn?: UseSortCompareFn<T>
}

export function useSort<T>(arr: MaybeRef<T[]>, sortFn: UseSortFn<T>, options: UseSortOptions<T> = {}) {
  const { compareFn = defaultCompare } = options
  return computed(() => sortFn(unref(arr), compareFn as UseSortCompareFn<T>))
}
