import { computed } from '@vue/reactivity'
import type { MaybeRef } from '@vueuse/shared'
import { isRef, unref, watch } from 'vue-demi'

export type UseSortCompareFn<T> = (a: T, b: T) => number

export type UseSortFn<T> = (arr: T[], compareFn: UseSortCompareFn<T>) => T[]

const defaultCompare: UseSortCompareFn<number> = (a, b) => a - b

export function quickSort<T>(arr: T[], compareFn: UseSortCompareFn<T>): T[] {
  // sorted
  if (arr.length <= 1) return arr

  const pivot = arr.shift()!
  const centerArr: T[] = [pivot]
  const left: T[] = []
  const right: T[] = []

  for (let i = 0; i < arr.length; i++) {
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

export function useQuickSort<T>(arr: MaybeRef<T[]>, options: {
  pure?: boolean
  compareFn?: UseSortCompareFn<T>
} = {}) {
  const { compareFn = defaultCompare, pure = false } = options
  if (pure) {
    if (isRef(arr)) {
      watch(arr, () => {
        arr.value = quickSort(unref(arr), compareFn as UseSortCompareFn<T>)
      })
    }
    else {
      arr.length = 0
      arr.push(...quickSort(unref(arr), compareFn as UseSortCompareFn<T>))
    }
    return arr
  }
  else {
    return computed(() => quickSort(unref(arr), compareFn as UseSortCompareFn<T>))
  }
}
