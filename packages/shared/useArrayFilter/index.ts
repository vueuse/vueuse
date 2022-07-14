import type { MaybeComputedRef } from '@vueuse/shared'
import { resolveUnref } from '@vueuse/shared'
import type { ComputedRef } from 'vue-demi'
import { computed } from 'vue-demi'

export function useArrayFilter<T>(
  list: MaybeComputedRef<MaybeComputedRef<T>[]>,
  fn: (element: T, index: number, array: T[]) => boolean,
): ComputedRef<T[]> {
  return computed(() => resolveUnref(list).map(i => resolveUnref(i)).filter(fn))
}
