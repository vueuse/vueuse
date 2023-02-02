import type { ComputedRef } from 'vue-demi'
import { computed } from 'vue-demi'
import type { MaybeComputedRef } from '../utils'
import { resolveUnref } from '../resolveUnref'

export interface UseTreeFindOptions {
  // The key of the child node default: 'children'
  childKey?: string
}

/**
 * Reactively find elements in a tree structure
 * @see https://vueuse.org/useTreeFind
 * @param {Array} tree - the array was called upon.
 * @param fn - a function to test each element.
 * @param [options]
 * @returns the first element in the array that satisfies the provided testing function. Otherwise, undefined is returned.
 */
export function useTreeFind<T>(
  tree: MaybeComputedRef<MaybeComputedRef<T>[]>,
  fn: (element: T, index: number, array: T[]) => boolean,
  options?: UseTreeFindOptions,
): ComputedRef<T | undefined> {
  const { childKey = 'children' } = options || {}

  const findTreeBy = (
    array: T[],
  ): T | undefined => {
    for (let i = 0; i < array.length; i++) {
      const item = array[i]
      if (fn(item, i, array))
        return item
      const children = item[childKey as keyof T]
      if (children) {
        const node = findTreeBy(children as T[])
        if (node)
          return node
      }
    }
  }

  return computed(() =>
    findTreeBy(resolveUnref(tree).map(element => resolveUnref(element))),
  )
}
