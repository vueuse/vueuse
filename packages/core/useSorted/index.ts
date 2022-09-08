import type { Ref } from 'vue-demi'
import type { MaybeRef } from '@vueuse/shared'
import { computed, isRef, unref, watchEffect } from 'vue-demi'

export type UseSortedCompareFn<T = any> = (a: T, b: T) => number

export type UseSortedFn<T = any> = (arr: T[], compareFn: UseSortedCompareFn<T>) => T[]

export interface UseSortedOptions<T = any> {
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

const defaultSortFn: UseSortedFn = <T>(source: T[], compareFn: UseSortedCompareFn<T>): T[] => source.sort(compareFn)
const defaultCompare: UseSortedCompareFn<number> = (a, b) => a - b

export function useSorted<T = any>(source: MaybeRef<T[]>, compareFn?: UseSortedCompareFn<T>): Ref<T[]>
export function useSorted<T = any>(source: MaybeRef<T[]>, options?: UseSortedOptions<T>): Ref<T[]>
export function useSorted<T = any>(source: MaybeRef<T[]>, compareFn?: UseSortedCompareFn<T>, options?: Omit<UseSortedOptions<T>, 'compareFn'>): Ref<T[]>
/**
 * reactive sort array
 *
 * @see https://vueuse.org/useSorted
 * @param source source array
 * @param options
 */
export function useSorted(...args: any[]) {
  const [source] = args
  let compareFn: UseSortedCompareFn = defaultCompare
  let options: UseSortedOptions = {}

  if (args.length === 2) {
    if (typeof args[1] === 'object') {
      options = args[1]
      compareFn = options.compareFn ?? defaultCompare
    }
    else {
      compareFn = args[1] ?? defaultCompare
    }
  }
  else if (args.length > 2) {
    compareFn = args[1] ?? defaultCompare
    options = args[2] ?? {}
  }

  const {
    dirty = false,
    sortFn = defaultSortFn,
  } = options

  if (!dirty)
    return computed(() => sortFn([...unref(source)], compareFn))

  // dirty
  watchEffect(() => {
    const result = sortFn(unref(source), compareFn)
    if (isRef(source))
      source.value = result
    else
      source.splice(0, source.length, ...result)
  })

  return source
}
