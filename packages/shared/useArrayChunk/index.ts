import { computed } from 'vue-demi'
import type { ComputedRef } from 'vue-demi'

import type { MaybeRefOrGetter } from '../utils'
import { toValue } from '../toValue'

export function useArrayChunk<T>(array: MaybeRefOrGetter<T[]>, chunkSize: number): ComputedRef<T[][]>

/**
 * Reactive get array chunks based on chunk size
 * @see https://vueuse.org/useArrayChunk
 * @returns {Array} - the chunks of array
 * @param list
 * @param chunkSize
 */

export function useArrayChunk<T>(list: MaybeRefOrGetter<MaybeRefOrGetter<T>[]>, chunkSize: number): ComputedRef<T[][]> {
  return computed(() => {
    const result = []
    const arr = toValue(list).map(i => toValue(i))

    for (let i = 0, j = arr.length; i < j; i += chunkSize)
      result.push(arr.slice(i, i + chunkSize))

    return result
  })
}
