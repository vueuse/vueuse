import type { ComputedRef } from 'vue-demi'
import { computed } from 'vue-demi'
import type { MaybeComputedRef } from '../utils'
import { resolveUnref } from '../resolveUnref'

export interface UseArrayUniqueOptions {
  /**
   * Use that object property for deduplication
   */
  property?: string
}

export function useArrayUnique<T = any>(list: MaybeComputedRef<MaybeComputedRef<T>[]>, property?: string): ComputedRef<T[]>
export function useArrayUnique<T = any>(list: MaybeComputedRef<MaybeComputedRef<T>[]>, options?: UseArrayUniqueOptions): ComputedRef<T[]>

/**
 * reactive unique array
 * @see https://vueuse.org/useArrayUnique
 * @param {Array} list - the array was called upon.
 * @returns {Array} A computed ref that returns a unique array of items.
 */
export function useArrayUnique<T>(...args: any[]): ComputedRef<T[]> {
  const [list] = args
  let options = args[1] ?? { property: null }
  if (typeof options === 'string')
    options = { property: options }

  if (typeof options.property === 'string') {
    const identifiers = [...new Set<T>(resolveUnref(list).map((element: any) => resolveUnref(element)?.[options.property]))]
    return computed<T[]>(() => identifiers.map(identifier => resolveUnref(list).find((element: any) => resolveUnref(element)?.[options.property] === identifier)))
  }
  return computed<T[]>(() => [...new Set<T>(resolveUnref(list).map((element: any) => resolveUnref(element)))])
}
