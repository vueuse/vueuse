import type { MaybeComputedRef } from '@vueuse/shared'
import { resolveUnref } from '@vueuse/shared'
import type { ComputedRef } from 'vue-demi'
import { computed } from 'vue-demi'

export function useArrayMap<T>(
  list: MaybeComputedRef<MaybeComputedRef<T>[]>,
  fn: (element: T, index: number, array: T[]) => T,
): ComputedRef<T[]> {
  return computed(() => resolveUnref(list).map(i => resolveUnref(i)).map(fn))
}
