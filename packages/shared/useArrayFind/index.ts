import type { MaybeComputedRef } from '@vueuse/shared'
import type { ComputedRef } from 'vue-demi'
import { resolveUnref } from '@vueuse/shared'
import { computed } from 'vue-demi'

export function useArrayFind<T>(
  list: MaybeComputedRef<MaybeComputedRef<T>[]>,
  fn: (element: T, index: number, array: MaybeComputedRef<T>[]) => boolean,
): ComputedRef<T | undefined> {
  return computed(() => {
    const find = Array.prototype.find.bind(resolveUnref(list))

    const findCallback = (element: MaybeComputedRef<T>, index: number, array: MaybeComputedRef<T>[]) => fn(resolveUnref(element), index, array)

    return resolveUnref(find(findCallback))
  })
}
