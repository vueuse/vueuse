import type { FuseResult, IFuseOptions } from 'fuse.js'
import type { ComputedRef, MaybeRefOrGetter, Ref } from 'vue'
import Fuse from 'fuse.js'
import { computed, shallowRef, toValue, watch } from 'vue'

export type FuseOptions<T> = IFuseOptions<T>
export interface UseFuseOptions<T> {
  fuseOptions?: FuseOptions<T>
  resultLimit?: number
  matchAllWhenSearchEmpty?: boolean
}

export interface UseFuseReturn<DataItem> {
  fuse: Ref<Fuse<DataItem>>
  results: ComputedRef<FuseResult<DataItem>[]>
}

export function useFuse<DataItem>(
  search: MaybeRefOrGetter<string>,
  data: MaybeRefOrGetter<DataItem[]>,
  options?: MaybeRefOrGetter<UseFuseOptions<DataItem>>,
): UseFuseReturn<DataItem> {
  const createFuse = (
    d = toValue(data) ?? [],
    fuseOpts = toValue(options)?.fuseOptions,
  ) => new Fuse(d, fuseOpts)

  const fuse = shallowRef(createFuse())

  watch(
    [() => toValue(data), () => toValue(options)?.fuseOptions],
    ([newData, newFuseOptions]) => { fuse.value = createFuse(newData ?? [], newFuseOptions) },
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
