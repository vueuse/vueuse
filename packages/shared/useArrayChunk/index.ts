import type { ComputedRef } from 'vue-demi'
import { computed } from 'vue-demi'
import type { MaybeComputedRef } from '@vueuse/shared'
import { resolveUnref } from '@vueuse/shared'

/**
 * Split array into groups the length of `size`.
 *
 * @see https://vueuse.org/useArrayChunk
 * @param array
 * @param size
 */
export function useArrayChunk<T>(
  array: MaybeComputedRef<MaybeComputedRef<T>[]>,
  size: MaybeComputedRef<number> = 1,
): ComputedRef<T[][]> {
  return computed(() => {
    const v = resolveUnref(array).map(resolveUnref)
    const s = resolveUnref(size)
    if (v.length === 0 || s < 1)
      return []
    return Array.from({ length: Math.ceil(v.length / s) }, (_, i) =>
      v.slice(i * s, i * s + s),
    )
  })
}
