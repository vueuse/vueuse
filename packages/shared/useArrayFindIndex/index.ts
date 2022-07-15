import type { MaybeComputedRef } from '@vueuse/shared'
import { resolveUnref } from '@vueuse/shared'
import type { ComputedRef } from 'vue-demi'
import { computed } from 'vue-demi'

export function useArrayFindIndex<T>(
  list: MaybeComputedRef<MaybeComputedRef<T>[]>,
  fn: (element: T, index: number, array: MaybeComputedRef<T>[]) => boolean,
): ComputedRef<number> {
  const cb = (element: MaybeComputedRef<T>, index: number, array: MaybeComputedRef<T>[]) => fn(resolveUnref(element), index, array)
  return computed(() => resolveUnref(list).findIndex(cb))
}
