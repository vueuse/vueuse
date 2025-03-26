import type { FuseResult, IFuseOptions } from 'fuse.js'
import type { ComputedRef, MaybeRefOrGetter } from 'vue'
import Fuse from 'fuse.js'
import { computed, ref as deepRef, toValue, watch } from 'vue'

export type FuseOptions<T> = IFuseOptions<T>
export interface UseFuseOptions<T> {
  fuseOptions?: FuseOptions<T>
  resultLimit?: number
  matchAllWhenSearchEmpty?: boolean
}

export function useFuse<DataItem>(
  search: MaybeRefOrGetter<string>,
  data: MaybeRefOrGetter<DataItem[]>,
  options?: MaybeRefOrGetter<UseFuseOptions<DataItem>>,
) {
  const createFuse = () => {
    return new Fuse(
      toValue(data) ?? [],
      toValue(options)?.fuseOptions,
    )
  }

  const fuse = deepRef(createFuse())

  watch(
    () => toValue(options)?.fuseOptions,
    () => { fuse.value = createFuse() },
    { deep: true },
  )

  watch(
    () => toValue(data),
    (newData) => { fuse.value.setCollection(newData) },
    { deep: true },
  )

  const results: ComputedRef<FuseResult<DataItem>[]> = computed(() => {
    const resolved = toValue(options)
    // This will also be recomputed when `data` changes, as it causes a change
    // to the Fuse instance, which is tracked here.
    if (resolved?.matchAllWhenSearchEmpty && !toValue(search))
      return toValue(data).map((item, index) => ({ item, refIndex: index }))

    const limit = resolved?.resultLimit
    return fuse.value.search(toValue(search), (limit ? { limit } : undefined))
  })

  return {
    fuse,
    results,
  }
}

export type UseFuseReturn = ReturnType<typeof useFuse>
