import type { MaybeRef } from '@vueuse/shared'
import type { UseSortCompareFn, UseSortOptions } from '../useSort'
import { useSort } from '../useSort'

export function quickSort<T>(arr: T[], compareFn: UseSortCompareFn<T>): T[] {
  // sorted
  if (arr.length <= 1) return arr

  const pivot = arr[0]
  const centerArr: T[] = [pivot]
  const left: T[] = []
  const right: T[] = []

  for (let i = 1; i < arr.length; i++) {
    const element = arr[i]
    const compare = compareFn(element, pivot)
    if (compare === 0)
      centerArr.push(element)
    else if (compare < 0)
      left.push(element)
    else
      right.push(element)
  }

  return quickSort(left, compareFn).concat(centerArr, quickSort(right, compareFn))
}

export function useQuickSort<T>(arr: MaybeRef<T[]>, options: UseSortOptions<T> = {}) {
  return useSort(arr, quickSort, options)
}
