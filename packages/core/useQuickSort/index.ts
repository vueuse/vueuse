import type { UseSortCompareFn } from '../useSort'
import { useSortWrapFn } from '../useSort'

export function quickSort<T>(source: T[], compareFn: UseSortCompareFn<T>): T[] {
  // sorted
  if (source.length <= 1) return source

  const pivot = source[0]
  const centerArr: T[] = [pivot]
  const left: T[] = []
  const right: T[] = []

  for (let i = 1; i < source.length; i++) {
    const element = source[i]
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

export const useQuickSort = useSortWrapFn(quickSort)
